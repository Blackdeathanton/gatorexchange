package models

import (
	"time"
)

type Question struct {
	Author      string    `json:"author"`
	Email       string    `json:"author_email"`
	Title       string    `json:"title"`
	Body        string    `json:"body"`
	Tags        []string  `json:"tags"`
	Answers     []Answer  `json:"answers"`
	Comments    []Comment `json:"comments"`
	Upvotes     int       `json:"upvotes"`
	Downvotes   int       `json:"downvotes"`
	Views       int       `json:"views"`
	CreatedTime time.Time `json:"created_time"`
	UpdatedTime time.Time `json:"updated_time"`
}

type Answer struct {
	Author      string    `json:"author"`
	Body        string    `json:"body"`
	Upvotes     int       `json:"upvotes"`
	Downvotes   int       `json:"downvotes"`
	CreatedTime time.Time `json:"created_time"`
	UpdatedTime time.Time `json:"updated_time"`
	Comments    []Comment `json:"comments"`
}

type Comment struct {
	Author      string    `json:"author"`
	Body        string    `json:"body"`
	CreatedTime time.Time `json:"created_time"`
	UpdatedTime time.Time `json:"updated_time"`
}
