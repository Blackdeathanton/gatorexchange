package routes

import (
	"backend-v1/src/config"
	"backend-v1/src/controllers"

	"github.com/gin-gonic/contrib/static"
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

	rest.Use(static.Serve("/", static.LocalFile("./web", true)))
	rest.Use(static.Serve("/questions", static.LocalFile("./web", true)))
	rest.Use(static.Serve("/tags", static.LocalFile("./web", true)))

	users := rest.Group("/api/users")
	{
		users.POST("/signup", controllers.CreateUser())
		users.POST("/login", controllers.LoginUser())
	}
	// v1 APIs
	v1_unauth := rest.Group("/api/v1")
	{
		v1_unauth.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Worked well! Change working",
			})
		})
		// GetAllQuestions()
		v1_unauth.GET("/questions", controllers.GetAllQuestions())
		// GetQuestionById()
		v1_unauth.GET("/questions/:id", controllers.GetQuestionById())
	}

	// v2_unauth APIs
	v2_unauth := rest.Group("/api/v2")
	{
		// Search API
		v2_unauth.GET("/search", controllers.SearchQuestions())
	}

	// v3 APIs
	v3_unauth := rest.Group("/api/v3")
	{
		// Get Questions by Tag Api
		v3_unauth.GET("/questions/tagged/:tag", controllers.GetQuestionByTags())
		// Fetch all the tags Api
		v3_unauth.GET("/tags", controllers.GetAllTagsFromQuestions())
	}

	rest.Use(config.Authentication())

	v1_auth := rest.Group("/api/v1")
	{
		// AddQuestion()
		v1_auth.POST("/questions", controllers.AddQuestion())
	}

	// v2_unauth APIs
	v2_auth := rest.Group("/api/v2")
	{
		// Delete a question with an ID
		v2_auth.DELETE("/questions/:id", controllers.DeleteQuestionById())
		// Add Answer API
		v2_auth.POST("/answers", controllers.AddAnswer())
		// Add Comment API
		v2_auth.POST("/comments", controllers.AddComment())
		// Update Upvote and Downvote count API
		v2_auth.POST("/questions/:id/vote/:vote", controllers.UpdateVotes())
	}

	// v3 APIs
	v3_auth := rest.Group("/api/v3")
	{
		// Update Question Data Api
		v3_auth.POST("/questions/:id/update", controllers.UpdateQuestion())
		// Update Answer Data Api
		v3_auth.POST("/questions/:id/answers/:aid/update", controllers.UpdateAnswer())
		// Delete an Answer with Id Api
		v3_auth.DELETE("/questions/:id/answers/:aid", controllers.DeleteAnswerById())
		// Update Upvote and Downvote count for Answers Api
		v3_auth.POST("/questions/:id/answers/:aid/vote/:vote", controllers.UpdateAnswerVotes())
	}

	return rest.Run()
}
