package controllers

import (
	"backend-v1/src/config"
	"backend-v1/src/models"
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var questionCollection *mongo.Collection = config.GetCollection(config.MClient, "questions")
var validate = validator.New()

func AddQuestion() gin.HandlerFunc {
	return func(con *gin.Context) {
		c, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var q models.Question

		defer cancel()
		fmt.Println(q)

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
			Answers:     q.Answers,
			Comments:    q.Comments,
			Upvotes:     q.Upvotes,
			Downvotes:   q.Downvotes,
			Views:       q.Views,
			CreatedTime: time.Now(),
			UpdatedTime: time.Now(),
		}

		qu, err := questionCollection.InsertOne(c, newQ)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		con.JSON(http.StatusCreated, qu)
	}
}

func GetAllQuestions() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		cursor, err := questionCollection.Find(ctx, bson.M{})
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		var questions []bson.M
		if err = cursor.All(ctx, &questions); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error reading data": err})
		}

		con.JSON(http.StatusOK, questions)
	}
}

func GetQuestionById() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		id := con.Param("id")
		objId, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		var question bson.M
		if err := questionCollection.FindOne(ctx, bson.M{"id":objId}).Decode(&question); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}

		con.JSON(http.StatusOK, question)
	}
}
