package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	Id          primitive.ObjectID `json:"id,omitempty"`
	Author      string             `json:"author,omitempty" validate:"required"`
	Email       string             `json:"author_email,omitempty" validate:"required"`
	Title       string             `json:"title,omitempty" validate:"required"`
	Body        string             `json:"body,omitempty" validate:"required"`
	Tags        []string           `json:"tags,omitempty" validate:"required"`
	Answers     []Answer           `json:"answers,omitempty"`
	Comments    []Comment          `json:"comments,omitempty"`
	Upvotes     int                `json:"upvotes,omitempty"`
	Downvotes   int                `json:"downvotes,omitempty"`
	Views       int                `json:"views,omitempty"`
	CreatedTime time.Time          `json:"created_time,omitempty"`
	UpdatedTime time.Time          `json:"updated_time,,omitempty"`
}

type Answer struct {
	Id          primitive.ObjectID `json:"id,omitempty"`
	QuestionId  string             `json:"question_id" validate:"required"`
	Author      string             `json:"author" validate:"required"`
	Body        string             `json:"body" validate:"required"`
	Upvotes     int                `json:"upvotes,omitempty"`
	Downvotes   int                `json:"downvotes,omitempty"`
	CreatedTime time.Time          `json:"created_time,omitempty"`
	UpdatedTime time.Time          `json:"updated_time,omitempty"`
	Comments    []Comment          `json:"comments,omitempty"`
}

type Comment struct {
	Id          primitive.ObjectID `json:"id,omitempty"`
	QuestionId  string             `json:"question_id" validate:"required"`
	AnswerId    string             `json:"answer_id,omitempty"`
	Author      string             `json:"author" validate:"required"`
	Body        string             `json:"body" validate:"required"`
	CreatedTime time.Time          `json:"created_time,omitempty"`
	UpdatedTime time.Time          `json:"updated_time,omitempty"`
}

type User struct {
	Id           primitive.ObjectID `json:"id,omitempty"`
	Username     string             `json:"username" validate:"required"`
	FirstName    string             `json:"first_name" validate:"required"`
	LastName     string             `json:"last_name" validate:"required"`
	Email        string             `json:"email" validate:"email,required"`
	Password     string             `json:"password" validate:"required,min=8"`
	Token        string             `json:"token"`
	RefreshToken string             `json:"refresh_token"`
	CreatedTime  time.Time          `json:"created_time,omitempty"`
	UpdatedTime  time.Time          `json:"updated_time,omitempty"`
}
