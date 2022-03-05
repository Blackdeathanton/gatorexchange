package controllers

import (
	"backend-v1/src/config"
	"backend-v1/src/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var questionCollection *mongo.Collection = config.GetCollection(config.MClient, "questions")
var validate = validator.New()

/*
	This API is responsible for adding a new question
	to the database.
*/
func AddQuestion() gin.HandlerFunc {
	return func(con *gin.Context) {
		c, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var q models.Question

		defer cancel()

		if err := con.BindJSON(&q); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		valErr := validate.Struct(&q)
		if valErr != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": valErr.Error()})
			return
		}

		newQ := models.Question{
			Id:          primitive.NewObjectID(),
			Author:      q.Author,
			Email:       q.Email,
			Title:       q.Title,
			Body:        q.Body,
			Tags:        q.Tags,
			Answers:     []models.Answer{},
			Comments:    []models.Comment{},
			Upvotes:     q.Upvotes,
			Downvotes:   q.Downvotes,
			Views:       q.Views,
			CreatedTime: time.Now(),
			UpdatedTime: time.Now(),
		}

		_, err := questionCollection.InsertOne(c, newQ)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		con.JSON(http.StatusCreated, gin.H{"InsertedID": newQ.Id})
	}
}

/*
	This API is responsible for getting all questions
	from the database.
*/
func GetAllQuestions() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		cursor, err := questionCollection.Find(ctx, bson.M{})
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		var questions []bson.M
		if err = cursor.All(ctx, &questions); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error reading data": err})
			return
		}

		con.JSON(http.StatusOK, questions)
	}
}

/*
	This API is responsible for getting all question
	with the specific ID from the database.
*/
func GetQuestionById() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		id := con.Param("id")
		objId, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		var question bson.M
		var filter = bson.M{"id": objId}
		var update = bson.M{"$inc": bson.M{"views": 1}}
		var opts = options.FindOneAndUpdate().SetReturnDocument(options.After)

		if err := questionCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&question); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		con.JSON(http.StatusOK, question)
	}
}

/*
	This API is responsible for deleting the question
	with a specific ID from the database.
*/
func DeleteQuestionById() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		id := con.Param("id")

		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(id)
		result, err := questionCollection.DeleteOne(ctx, bson.M{"id": objId})

		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		if result.DeletedCount < 1 {
			con.JSON(http.StatusNotFound, gin.H{"error": "Question with the ID is not found"})
			return
		}

		con.JSON(http.StatusOK, gin.H{"status": "Question deleted successfully"})
	}
}

/*
	This API is responsible for updating the votes 
	of a question with a specific ID in the database.
*/
func UpdateVotes() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		id := con.Param("id")
		vote := con.Param("vote")
		defer cancel()
		
		questionId, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		
		var filter = bson.M{"id": questionId}
		var increment bson.M
		if vote == "upvote" {
			increment = bson.M{"upvotes": 1}
		} else if vote == "downvote" {
			increment = bson.M{"downvotes": 1}
		} else {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		var update = bson.M{"$inc": increment}
		_, err = questionCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		con.JSON(http.StatusCreated, gin.H{"status": "Vote updated successfully"})
	}
}
