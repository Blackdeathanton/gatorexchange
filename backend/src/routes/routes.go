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
		// v1.GET("/questions", h.GetAllQuestions)
		// // GetQuestionById()
		// v1.GET("/questions/:id", h.GetQuestionById)
		// AddQuestion()
		v1.POST("/questions", controllers.AddQuestion())
	}

	return rest.Run(address)
}
