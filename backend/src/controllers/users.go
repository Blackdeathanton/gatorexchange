package controllers

import (
	"backend-v1/src/config"
	"backend-v1/src/models"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection = config.GetCollection(config.MClient, "users")

/*
	This method is responsible for hashing the password before it is
	stored in the database
*/
func GetHashedPassword(password string) string {
	b, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}

	return string(b)
}

/*
	This method is responsible for comparing the provided password
	with the hashed password stored in the database
*/
func ComparePassword(hashed string, password string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(password), []byte(hashed))
	if err != nil {
		return false, "Authentication failed"
	}
	return true, "Authenticated"
}

/*
	This method is responsible for creating a user
*/
func CreateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var user models.User

		defer cancel()

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}

		valErr := validate.Struct(&user)
		if valErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": valErr.Error()})
			return
		}

		count, err := userCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		if count > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Email Address exists already"})
			return
		}

		count, err = userCollection.CountDocuments(ctx, bson.M{"username": user.Username})
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		if count > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Username exists already"})
			return
		}

		password := GetHashedPassword(user.Password)
		userId := primitive.NewObjectID()
		token, refreshToken, _ := config.GenerateAllTokens(user.Email, user.Username, userId.Hex())

		newUser := models.User{
			Id:           userId,
			Username:     user.Username,
			FirstName:    user.FirstName,
			LastName:     user.LastName,
			Email:        user.Email,
			Password:     password,
			Token:        token,
			RefreshToken: refreshToken,
			CreatedTime:  time.Now(),
			UpdatedTime:  time.Now(),
		}

		insertedUser, err := userCollection.InsertOne(ctx, newUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		defer cancel()
		c.JSON(http.StatusOK, insertedUser)
	}
}

/*
	This method is responsible for logging in a user
*/
func LoginUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		var user models.User
		var foundUser models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}

		err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
			return
		}

		isValid, m := ComparePassword(user.Password, foundUser.Password)
		defer cancel()
		if !isValid {
			c.JSON(http.StatusInternalServerError, gin.H{"error": m})
			return
		}

		token, refreshToken, _ := config.GenerateAllTokens(foundUser.Email, foundUser.Username, foundUser.Id.Hex())
		config.UpdateAllTokens(token, refreshToken, foundUser.Id.Hex())

		c.JSON(http.StatusOK, foundUser)
	}
}

func GetUserData() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		username := con.Param("user")
		projection := bson.M{
			"$project": bson.M{
				"_id":                0,
				"password":           0,
				"refreshtoken":       0,
				"token":              0,
				"updatedtime":        0,
				"questions.answers":  0,
				"questions.comments": 0,
				"questions._id":      0,
				"questions.author":   0,
				"questions.email":    0,
			},
		}
		var match = bson.M{
			"$match": bson.M{"username": username},
		}
		var lookup_questions = bson.M{
			"$lookup": bson.M{
				"from":         "questions",
				"localField":   "username",
				"foreignField": "author",
				"as":           "questions",
			}}
		var answer_pipeline = []bson.M{
			{"$unwind": "$answers"},
			{"$match": bson.M{"answers.author": username}},
			{"$replaceRoot": bson.M{"newRoot": "$answers"}},
			{"$project": bson.M{"comments": 0, "author": 0}},
		}
		var tag_pipeline = []bson.M{
			{"$unwind": "$tags"},
			{"$match": bson.M{"author": username}},
			{"$group": bson.M{"_id": "$tags"}},
		}
		var lookup_answers = bson.M{
			"$lookup": bson.M{
				"from":     "questions",
				"pipeline": answer_pipeline,
				"as":       "answers",
			}}
		var lookup_tags = bson.M{
			"$lookup": bson.M{
				"from":     "questions",
				"pipeline": tag_pipeline,
				"as":       "tags",
			}}
		var pipeline = []bson.M{
			match,
			lookup_questions,
			lookup_answers,
			lookup_tags,
			projection,
		}

		cursor, err := userCollection.Aggregate(ctx, pipeline)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		var userdata []bson.M
		if err = cursor.All(ctx, &userdata); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading data"})
			return
		}

		con.JSON(http.StatusOK, userdata)
	}
}
