package tests

import (
	"backend-v1/src/config"
	"backend-v1/src/controllers"
	"backend-v1/src/models"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

/*
	This function is responsible for checking whether
	Search API returns a success status code.
*/
func TestSearchAPIStatusSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/search", controllers.SearchQuestions())
	req, _ := http.NewRequest("GET", "/search?q=go", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK
		return s
	})
}

/*
	This function is responsible for checking whether
	Search API has returned a proper response.
*/
func TestSearchAPIResponseCheck(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/search", controllers.SearchQuestions())
	req, _ := http.NewRequest("GET", "/search?q=go", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK
		data, err := ioutil.ReadAll(w.Body)
		if err != nil {
			return false
		}
		var questions []models.Question
		err = json.Unmarshal(data, &questions)

		return err == nil && len(questions) > 0 && s
	})
}

/*
	This function is responsible for checking whether
	SortQuestions API returns a success status code
	when an upvote or a downvote is added.
*/
func TestSortSearchResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/search", controllers.SearchQuestions())
	req, _ := http.NewRequest("GET", "/search?q=go&sort=upvotes", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK

		data, err := ioutil.ReadAll(w.Body)
		if err != nil {
			return false
		}
		var questions []models.Question
		err = json.Unmarshal(data, &questions)

		return err == nil && len(questions) > 0 && s
	})
}

/*
	This function is responsible for checking whether
	FilterQuestions API returns a success status code
	when an upvote or a downvote is added.
*/
func TestFilterSearchResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/search", controllers.SearchQuestions())
	req, _ := http.NewRequest("GET", "/search?q=go&filters=HasUpvotes,NoAnswers", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK

		data, err := ioutil.ReadAll(w.Body)
		if err != nil {
			return false
		}
		var questions []models.Question
		err = json.Unmarshal(data, &questions)

		return err == nil && len(questions) > 0 && s
	})
}
