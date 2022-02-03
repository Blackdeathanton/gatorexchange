# Gator Exchange - Backend

## Table of Contents

- [Description](#description)
- [Functionalities](#functionalities)
- [Configuration](#configuration)
- [Steps to Run](#steps-to-run)
- [API Details](#api-details)
- [Technology Stack](#technology-stack)

## Description

GatorExchange is an application that serves as a platform for users to ask and answer questions, through membership and active participation, to vote questions and answers up or down similar to Reddit and edit questions and answers in a fashion similar to a wiki. The backend part of the application mainly focusses on providing various API to implement the functionalities in Go.

## Functionalities

1. To add a new question to the questions database
2. To fetch all the questions present in the questions database
3. To fetch a particular question from the questions database

## Configuration

- A `.env` file is used to configure various environment variables to load the project
- The `.env` should be placed in the directory `backend`
- The mongoDB URL should be added to the `.env` as an environment variable `MONGOURI`

## Steps to Run

- Switch to the directory `backend`
- Run the command `go build ./main.go`
- `./main.exe` to run the server
- Visit the url `http://localhost:8000/`

## API Details

The below mentioned api are open endpoints and do not require authentication

- Add Question : `POST /questions/`
  * A POST api used to add a question posted by a guest/user to the questions database via the server

- Fetch All Questions : `GET /questions/`
  * A GET api the returns all the list of questions posted by guests/users in the questions database to the client via the server

- Fetch A Particular Question By ID : `GET /questions/:id`
  * A GET api that returns a single question, clicked on by the user, with a particular id posted by a guest/user, in the questions database to the client via the server


## Technology Stack
- Server: Go (Golang)
- Database: MongoDB
- Frameworks: Gin

![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
