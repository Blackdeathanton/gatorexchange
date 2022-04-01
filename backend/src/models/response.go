package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AddQuestionResponse struct {
	Id primitive.ObjectID `json:"InsertedID,omitempty"`
}

type AddAnswerResponse struct {
	Id primitive.ObjectID `json:"InsertedID,omitempty"`
}
