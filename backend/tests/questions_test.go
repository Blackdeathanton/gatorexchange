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

/*
	This function is responsible for checking whether
	AddQuestion API returns a created success status code
	when a question is added.
*/
func TestAddQuestionResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.POST("/questions", controllers.AddQuestion())
	r.DELETE("/questions/:id", controllers.DeleteQuestionById())
	jsonData := []byte(`{
		"author": "Josh Starmer",
		"author_email": "josh@ff.com",
		"title": "Test",
		"body": "Test",
		"tags": ["go", "web-development"]
	}`)

	req, _ := http.NewRequest("POST", "/questions", bytes.NewBuffer(jsonData))

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusCreated
		if !s {
			return s
		}

		data, err := ioutil.ReadAll(w.Body)
		if err != nil {
			return false
		}

		var q models.AddQuestionResponse
		err = json.Unmarshal(data, &q)

		if err != nil {
			return false
		}

		delReq, _ := http.NewRequest("DELETE", "/questions/"+q.Id.Hex(), nil)
		testHttpRequest(t, r, delReq, func(w *httptest.ResponseRecorder) bool {
			s := w.Code == http.StatusOK
			return s
		})
		return s
	})
}

/*
	This function is responsible for checking whether
	Vote API returns a success status code
	when an upvote or a downvote is added.
*/
func TestUpvoteDownvoteResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.POST("/questions/:id/vote/:vote", controllers.UpdateVotes())
	req, _ := http.NewRequest("POST", "/questions/61f8501e5a82885c6ef0def7/vote/upvote", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusOK
		if !s {
			return s
		}
		req, _ := http.NewRequest("POST", "/questions/61f8501e5a82885c6ef0def7/vote/downvote", nil)
		testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
			s := w.Code == http.StatusOK
			return s
		})
		return s
	})
}

/*
	This function is responsible for checking whether
	Vote API returns a failure status code
	when an upvote is tried to be added for a question
	that does not exist.
*/
func TestUpvoteDownvoteResponseFailure(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.POST("/questions/:id/vote/:vote", controllers.UpdateVotes())
	req, _ := http.NewRequest("POST", "/questions/61f8501e5a82885c6ef0def7aa/vote/upvote", nil)

	testHttpRequest(t, r, req, func(w *httptest.ResponseRecorder) bool {
		s := w.Code == http.StatusInternalServerError
		return s
	})
}

/*
	This function is responsible for checking whether
	SortQuestions API returns a success status code
	when an upvote or a downvote is added.
*/
func TestSortQuestionsResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions", controllers.GetAllQuestions())
	req, _ := http.NewRequest("GET", "/questions?sort=upvotes", nil)

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
	TaggedQuestions API returns a success status code
	when an upvote or a downvote is added.
*/
func TestTaggedQuestionsResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions/tagged/:tag", controllers.GetQuestionByTags())
	req, _ := http.NewRequest("GET", "/questions/tagged/go", nil)

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
func TestFilterQuestionsResponseSuccess(t *testing.T) {
	r := getRouter()
	config.CreateConn()

	r.GET("/questions", controllers.GetAllQuestions())
	req, _ := http.NewRequest("GET", "/questions?filters=HasUpvotes,NoAnswers", nil)

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
