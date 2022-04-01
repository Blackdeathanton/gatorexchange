package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func SearchQuestions() gin.HandlerFunc {
	return func(con *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer cancel()

		query, isValid := con.GetQuery("q")
		if !isValid {
			con.JSON(http.StatusInternalServerError, 404)
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

		var query_regex = "(?i).*" + query + ".*"
		filter := bson.M{
			"$or": bson.A{
				bson.M{"title": bson.M{"$regex": query_regex}},
				bson.M{"body": bson.M{"$regex": query_regex}},
			},
		}
		projection := bson.M{"answers": 0, "comments": 0}

		options.SetSort(sort)
		options.SetProjection(projection)

		cursor, err := questionCollection.Find(ctx, filter, options)
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
