package tests

import (
	"backend-v1/src/config"
	"backend-v1/src/controllers"
	"backend-v1/src/models"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

/*
	This function is responsible for testing the
	successful addition of an answer to a question
	and deletion of it.
*/
func TestAddAnswerResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.POST("/answers", controllers.AddAnswer())
	r.DELETE("/questions/:id/answers/:aid", controllers.DeleteAnswerById())
	jsonData := []byte(`{
		"question_id": "61f8501e5a82885c6ef0def8",
		"author": "jacob999",
		"body": "This is a test answer! This is a test answer",
		"upvotes": 0,
		"downvotes": 0
	}`)

	req, _ := http.NewRequest("POST", "/answers", bytes.NewBuffer(jsonData))

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusCreated
		if !s {
			return s
		}
		data, err := ioutil.ReadAll(w.Body)
		if err != nil {
			return false
		}

		var a models.AddAnswerResponse
		err = json.Unmarshal(data, &a)

		if err != nil {
			return false
		}

		delReq, _ := http.NewRequest("DELETE", "/questions/61f8501e5a82885c6ef0def7/answers/"+a.Id.Hex(), nil)
		testHttpRequest(t, r, delReq, func(w *httptest.ResponseRecorder) bool {
			s := w.Code == http.StatusOK
			return s
		})
		return s
	})
}

/*
	This function is responsible for testing the
	failure response of adding answer to a question
	with question ID that does not exist.
*/
func TestAddAnswerResponseFailure(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.POST("/answers", controllers.AddAnswer())
	jsonData := []byte(`{
		"question_id": "61f8501e5a82885c6ef0def8a",
		"author": "jacob999",
		"body": "This is a test answer! This is a test answer",
		"upvotes": 0,
		"downvotes": 0
	}`)

	req, _ := http.NewRequest("POST", "/answers", bytes.NewBuffer(jsonData))

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		return w.Code == http.StatusInternalServerError
	})
}
