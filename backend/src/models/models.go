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
	Answers     []Answer           `json:"answers,omitempty" validate:"required"`
	Comments    []Comment          `json:"comments,omitempty" validate:"required"`
	Upvotes     int                `json:"upvotes,omitempty"`
	Downvotes   int                `json:"downvotes,omitempty"`
	Views       int                `json:"views,omitempty"`
	CreatedTime time.Time          `json:"created_time,omitempty"`
	UpdatedTime time.Time          `json:"updated_time,,omitempty"`
}

type Answer struct {
	Id          primitive.ObjectID `json:"id,omitempty"`
	Author      string             `json:"author" validate:"required"`
	Body        string             `json:"body" validate:"required"`
	Upvotes     int                `json:"upvotes" validate:"required"`
	Downvotes   int                `json:"downvotes" validate:"required"`
	CreatedTime time.Time          `json:"created_time" validate:"required"`
	UpdatedTime time.Time          `json:"updated_time" validate:"required"`
	Comments    []Comment          `json:"comments" validate:"required"`
}

type Comment struct {
	Id          primitive.ObjectID `json:"id,omitempty"`
	Author      string             `json:"author" validate:"required"`
	Body        string             `json:"body" validate:"required"`
	CreatedTime time.Time          `json:"created_time" validate:"required"`
	UpdatedTime time.Time          `json:"updated_time" validate:"required"`
}
