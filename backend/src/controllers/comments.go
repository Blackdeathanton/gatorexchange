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

func AddComment() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var comment models.Comment

		defer cancel()
		fmt.Println(comment)

		if err := con.BindJSON(&comment); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		valErr := validate.Struct(&comment)
		if valErr != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": valErr.Error()})
			return
		}

		var questionIdHex = comment.QuestionId
		var answerIdHex = comment.AnswerId
		comment.Id = primitive.NewObjectID()
		comment.CreatedTime = time.Now()
		comment.UpdatedTime = time.Now()
		var filter bson.M
		var update bson.M

		questionId, err := primitive.ObjectIDFromHex(questionIdHex)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		answerId, _ := primitive.ObjectIDFromHex(answerIdHex)
		
		if answerIdHex == "" {
			filter = bson.M{"id": questionId}
			update = bson.M{
				"$push": bson.M{
					"comments": comment,
				}}
		} else {
			filter = bson.M{"id": questionId, "answers.id": answerId}
			update = bson.M{
				"$push": bson.M{
					"answers.$.comments": comment,
				}}
		}
		qu, err := questionCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		con.JSON(http.StatusCreated, qu)
	}
}
