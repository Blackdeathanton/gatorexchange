package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

/*
	This function is responsible for checking if the router object
	is created properly and when configuring a route, the response
	received is correct.
*/
func TestGinRouterAndResponse(t *testing.T) {
	r := getRouter()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Worked well!",
		})
	})
	req, _ := http.NewRequest("GET", "/", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK
		return s
	})
}
