package controllers

import (
	"backend-v1/src/config"
	"backend-v1/src/models"
	"context"
	"net/http"
	"strings"
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
		
		projection := bson.M{
			"answers_count": bson.M{"$size": "$answers"}, 
			"comments_count": bson.M{"$size": "$comments"}, 
			"body": 1, 
			"createdtime": 1, 
			"downvotes": 1, 
			"tags": 1, 
			"title": 1, 
			"updatedtime": 1, 
			"upvotes": 1, "views": 1, 
			"id": 1, 
			"email": 1, 
			"author": 1,
		}
		sort := bson.M{"createdtime": -1}
		options := options.Find()

		sortOrder, isValid := con.GetQuery("sort")
		if isValid {
			if sortOrder == "upvotes" {
				sort = bson.M{"upvotes": -1}
			} else if sortOrder == "views" {
				sort = bson.M{"views": -1}
			}
		}

		filter := bson.M{}
		filterParams, isValid := con.GetQuery("filters")
		if isValid {
			var filtersList = strings.Split(filterParams, ",")
			for _, param := range filtersList {
				if param == "NoAnswers" {
					filter["answers"] = bson.M{"$exists": true, "$size": 0}
				} else if param == "HasUpvotes" {
					filter["upvotes"] = bson.M{"$exists": true, "$gt": 0}
				}
			}
		}

		options.SetSort(sort)
		options.SetProjection(projection)
		cursor, err := questionCollection.Find(ctx, filter, options)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		var questions []bson.M
		if err = cursor.All(ctx, &questions); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error":"Error reading data"})
			return
		}

		con.JSON(http.StatusOK, questions)
	}
}

/*
	This API is responsible for getting a question
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
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		con.JSON(http.StatusOK, question)
	}
}

/*
	This API is responsible for getting all the questions
	with the specific Tag from the database.
*/
func GetQuestionByTags() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		var tags = con.Param("tag")
		var tagsList = strings.Split(tags, " ")

		var filter = bson.M{
			"tags": bson.M{
				"$all": tagsList,
			}}
		
		projection := bson.M{
			"answers_count": bson.M{"$size": "$answers"}, 
			"comments_count": bson.M{"$size": "$comments"}, 
			"body": 1, 
			"createdtime": 1, 
			"downvotes": 1, 
			"tags": 1, 
			"title": 1, 
			"updatedtime": 1, 
			"upvotes": 1, "views": 1, 
			"id": 1, 
			"email": 1, 
			"author": 1,
		}
		sort := bson.M{"createdtime": -1}
		options := options.Find()

		sortOrder, isValid := con.GetQuery("sort")
		if isValid {
			if sortOrder == "upvotes" {
				sort = bson.M{"upvotes": -1}
			} else if sortOrder == "views" {
				sort = bson.M{"views": -1}
			}
		}

		filterParams, isValid := con.GetQuery("filters")
		if isValid {
			var filtersList = strings.Split(filterParams, ",")
			for _, param := range filtersList {
				if param == "NoAnswers" {
					filter["answers"] = bson.M{"$exists": true, "$size": 0}
				} else if param == "HasUpvotes" {
					filter["upvotes"] = bson.M{"$exists": true, "$gt": 0}
				}
			}
		}
		
		options.SetSort(sort)
		options.SetProjection(projection)

		cursor, err := questionCollection.Find(ctx, filter, options)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred while fetching the questions by tag"})
			return
		}

		var questions []bson.M
		if err = cursor.All(ctx, &questions); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An unknown error occurred"})
			return
		}

		con.JSON(http.StatusOK, questions)
	}
}

/*
	This API is responsible for updating a question
	with the updated values provided in the client.
*/
func UpdateQuestion() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var question bson.M

		defer cancel()
		
		if err := con.BindJSON(&question); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": "Bad input data"})
			return
		}

		id := con.Param("id")
		objId, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid question id"})
			return
		}

		var updatedQuestion bson.M
		question["updatedtime"] = time.Now()
		var filter = bson.M{"id": objId}
		var update = bson.M{"$set": question}
		var opts = options.FindOneAndUpdate().SetReturnDocument(options.After)

		if err := questionCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&updatedQuestion); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		con.JSON(http.StatusOK, updatedQuestion)
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
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
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
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}
		
		var filter = bson.M{"id": questionId}
		var increment bson.M
		if vote == "upvote" {
			increment = bson.M{"upvotes": 1}
		} else if vote == "downvote" {
			increment = bson.M{"downvotes": 1}
		} else {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}
		var update = bson.M{"$inc": increment}
		_, err = questionCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		con.JSON(http.StatusOK, gin.H{"status": "Vote updated successfully"})
	}
}
