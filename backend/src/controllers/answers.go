package controllers

import (
	"backend-v1/src/models"
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddAnswer() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var answer models.Answer

		defer cancel()
		fmt.Println(answer)

		if err := con.BindJSON(&answer); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		valErr := validate.Struct(&answer)
		if valErr != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": valErr.Error()})
			return
		}

		var questionIdHex = answer.QuestionId
		questionId, err := primitive.ObjectIDFromHex(questionIdHex)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
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
		qu, err := questionCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		con.JSON(http.StatusCreated, qu)
	}
}
