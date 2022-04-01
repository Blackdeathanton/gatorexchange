package controllers

import (
	"backend-v1/src/config"
	"backend-v1/src/models"
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var tagsCollection *mongo.Collection = config.GetCollection(config.MClient, "tags")

func AddTag() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var tag models.Tag

		defer cancel()

		if err := con.BindJSON(&tag); err != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": "An Error Occurred"})
			return
		}
		valErr := validate.Struct(&tag)
		if valErr != nil {
			con.JSON(http.StatusBadRequest, gin.H{"error": "An Error Occurred"})
			return
		}

		tag.Id = primitive.NewObjectID()

		if _, err := tagsCollection.InsertOne(ctx, tag); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
		}

		con.JSON(http.StatusCreated, gin.H{"InsertedID": tag.Id})
	}
}

func GetAllTags() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()
		
		cursor, err := tagsCollection.Find(ctx, bson.M{})
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		var tags []bson.M
		if err = cursor.All(ctx, &tags); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		con.JSON(http.StatusOK, tags)
	}
}

func GetAllTagsFromQuestions() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		//project := bson.M{ "$project": bson.M{"tags": 1}}
		unwind := bson.M{"$unwind": "$tags"}
		group := bson.M{ 
			"$group": bson.M{ 
				"_id": "$tags",
				"count": bson.M{ "$sum": 1 }}}
		
		cursor, err := questionCollection.Aggregate(ctx, []bson.M{unwind, group})
		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		var tags []bson.M
		if err = cursor.All(ctx, &tags); err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		con.JSON(http.StatusOK, tags)
	}
}

func DeleteTagByName() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		tag := con.Param("tag")

		defer cancel()
		
		result, err := questionCollection.DeleteOne(ctx, bson.M{"name": tag})

		if err != nil {
			con.JSON(http.StatusInternalServerError, gin.H{"error": "An Error Occurred"})
			return
		}

		if result.DeletedCount < 1 {
			con.JSON(http.StatusNotFound, gin.H{"error": "Invalid Tag Id"})
			return
		}

		con.JSON(http.StatusOK, gin.H{"status": "Tag deleted successfully"})
	}
}