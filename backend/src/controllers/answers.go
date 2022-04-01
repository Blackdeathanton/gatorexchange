package controllers

import (
	"backend-v1/src/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AddAnswer() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var answer models.Answer

		defer cancel()

		if err := con.BindJSON(&answer); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": "Error occured while adding answer"})
			return
		}
		valErr := validate.Struct(&answer)
		if valErr != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": "Error occured while adding answer"})
			return
		}

		var questionIdHex = answer.QuestionId
		questionId, err := primitive.ObjectIDFromHex(questionIdHex)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "Error occured while adding answer"})
			return
		}

		answer.Id = primitive.NewObjectID()
		answer.CreatedTime = time.Now()
		answer.UpdatedTime = time.Now()
		var filter = bson.M{"id": questionId}
		var update = bson.M{
			"$push": bson.M{
				"answers": answer,
			}}
		_, err = questionCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "Error occured while adding answer"})
			return
		}

		con.JSON(http.StatusCreated, gin.H{"InsertedID": answer.Id})
	}
}

/*
	This API is responsible for updating an answer
	with the updated values provided in the client.
*/
func UpdateAnswer() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var answer bson.M

		defer cancel()

		if err := con.BindJSON(&answer); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": "Bad input data"})
			return
		}

		question_id_hex := con.Param("id")
		question_id, err := primitive.ObjectIDFromHex(question_id_hex)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid question id"})
			return
		}
		answer_id_hex := con.Param("aid")
		answer_id, err := primitive.ObjectIDFromHex(answer_id_hex)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid answer id"})
			return
		}

		var updatedQuestion bson.M
		var filter = bson.M{"id": question_id, "answers.id": answer_id}
		var update = bson.M{
			"$set": bson.M{
				"answers.$.body": answer["body"],
				"answers.$.updatedtime": time.Now(),
			}}
		var opts = options.FindOneAndUpdate().SetReturnDocument(options.After)

		if err := questionCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&updatedQuestion); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		con.JSON(http.StatusOK, updatedQuestion)
	}
}

func DeleteAnswerById() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		question_id_hex := con.Param("id")
		answer_id_hex := con.Param("aid")
		defer cancel()

		question_id, _ := primitive.ObjectIDFromHex(question_id_hex)
		answer_id, _ := primitive.ObjectIDFromHex(answer_id_hex)

		var filter = bson.M{"id": question_id}
		var update = bson.M{
			"$pull": bson.M{
				"answers": bson.M{
					"id": answer_id,
			}}}
		var opts = options.FindOneAndUpdate().SetReturnDocument(options.After)
		
		var updatedQuestion bson.M
		err := questionCollection.FindOneAndUpdate(ctx, filter, update, opts).Decode(&updatedQuestion)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An unknown error occurred"})
			return
		}

		con.JSON(http.StatusOK, updatedQuestion)
	}
}

func UpdateAnswerVotes() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		question_id_hex := con.Param("id")
		answer_id_hex := con.Param("aid")
		vote := con.Param("vote")
		defer cancel()

		question_id, _ := primitive.ObjectIDFromHex(question_id_hex)
		answer_id, _ := primitive.ObjectIDFromHex(answer_id_hex)

		var filter = bson.M{"id": question_id, "answers.id": answer_id}
		var increment bson.M
		if vote == "upvote" {
			increment = bson.M{"answers.$.upvotes": 1}
		} else if vote == "downvote" {
			increment = bson.M{"answers.$.downvotes": 1}
		} else {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred"})
			return
		}
		var update = bson.M{"$inc": increment}
		_, err := questionCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An error occurred"})
			return
		}

		con.JSON(http.StatusOK, gin.H{"status": "Vote updated successfully"})
	}
}
