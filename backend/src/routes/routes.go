package routes

import (
	"backend-v1/src/config"
	"backend-v1/src/controllers"

	"github.com/gin-gonic/gin"
)

/*
	This method serves as the entry point of the RESTful API
*/
func RunAPI(address string) error {
	// Set Gin to Production Mode
	gin.SetMode(gin.ReleaseMode)

	rest := gin.Default()
	config.CreateConn()

	// v1 APIs
	v1 := rest.Group("/api/v1")
	{
		v1.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Worked well!",
			})
		})
		// GetAllQuestions()
		v1.GET("/questions", controllers.GetAllQuestions())
		// AddQuestion()
		v1.POST("/questions", controllers.AddQuestion())
		// GetQuestionById()
		v1.GET("/questions/:id", controllers.GetQuestionById())
	}

	// v2 APIs
	v2 := rest.Group("/api/v2")
	{
		// Delete a question with an ID
		v2.DELETE("/questions/:id", controllers.DeleteQuestionById())
		// Search API
		v2.GET("/search", controllers.SearchQuestions())
		// Add Answer API
		v2.POST("/answers", controllers.AddAnswer())
		// Add Comment API
		v2.POST("/comments", controllers.AddComment())
		// Update Upvote and Downvote count API
		v2.POST("/questions/:id/vote/:vote", controllers.UpdateVotes())
	}

	// v3 APIs
	v3 := rest.Group("/api/v3")
	{
		// Get Questions by Tag Api
		v3.GET("/questions/tagged/:tag", controllers.GetQuestionByTag())
		// Update Question Data Api
		v3.POST("/questions/:id/update", controllers.UpdateQuestion())
		// Update Answer Data Api
		v3.POST("/questions/:id/answers/:aid/update", controllers.UpdateAnswer())
	}

	return rest.Run(address)
}
