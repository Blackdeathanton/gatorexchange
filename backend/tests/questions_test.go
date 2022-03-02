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
	GetAllQuestions API returns a success status code.
*/
func TestGetAllQuestionsAPIStatusSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions", controllers.GetAllQuestions())
	req, _ := http.NewRequest("GET", "/questions", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK
		return s
	})
}

/*
	This function is responsible for checking whether
	GetAllQuestions API returns all some questions that
	are present in database
*/
func TestGetAllQuestionsAPIResponse(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions", controllers.GetAllQuestions())
	req, _ := http.NewRequest("GET", "/questions", nil)

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
	a wrong route returns a failure status code.
*/
func TestRandomAPIStatusFailure(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions", controllers.GetAllQuestions())

	req, _ := http.NewRequest("GET", "/question", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusNotFound
		return s
	})
}

/*
	This function is responsible for checking whether
	GetQuestionById API returns a success status code.
*/
func TestGetQuestionByIdStatusSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions/:id", controllers.GetQuestionById())
	req, _ := http.NewRequest("GET", "/questions/61f8501e5a82885c6ef0def7", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK
		return s
	})
}

/*
	This function is responsible for checking whether
	GetQuestionById API returns the proper question with
	the same ID.
*/
func TestGetQuestionByIdResponse(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions/:id", controllers.GetQuestionById())
	req, _ := http.NewRequest("GET", "/questions/61f8501e5a82885c6ef0def7", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK

		data, err := ioutil.ReadAll(w.Body)
		if err != nil {
			return false
		}

		var question models.Question
		err = json.Unmarshal(data, &question)

		return err == nil && question.Id.String() == "ObjectID(\"61f8501e5a82885c6ef0def7\")" && s
	})
}

/*
	This function is responsible for checking whether
	GetQuestionById API returns a failure status code
	when a wrong question ID is entered.
*/
func TestGetQuestionByIdStatusFailure(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions/:id", controllers.GetQuestionById())
	req, _ := http.NewRequest("GET", "/questions/61f8501e5a82885c6ef0de", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusInternalServerError
		return s
	})
}
