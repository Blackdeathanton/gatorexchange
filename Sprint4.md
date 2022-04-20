# Sprint 4

## Tasks Accomplished

### 1. Sprint Board

 - All the backend tasks were properly managed in the Sprint 4 board and the proper lifecycle has been followed.
 - All the frontend development tasks were managed using the Sprint 4 board under Projects tab. The proper lifecycle of issue creation, development, updating progress state, linking pull request with tasks, reviewing and merging code and pushing tasks to Done was followed correctly.

### 2. Backend Functionalities Implemented

 - Implemented an API to fetch all the questions, answers and tags posted by an user
 - Implemented an API to delete comments, posted in questions and answers 

### 3. Frontend Functionalities Implemented
 - Implemented a user profile page
 - Added edit and delete options for question 
 - Added edit and delete options for answer
 - Enhanced the filter and sort functionality of questions
 - Fixed the vote count calculation issue in question card
 - Added cypress tests for all the newly added features 

### 4. Documentation

 - Wiki has been updated with all the new backend APIs written. Proper video working of each API has also been added (https://github.com/Blackdeathanton/gatorexchange/wiki/Backend)
 - Proper documentation with detailed feature description along with demo videos for all the frontend features developed and integrated in Sprint 3 have been added to the Wiki(https://github.com/Blackdeathanton/gatorexchange/wiki/Frontend)

### 5. Steps to run the project (Backend)
1. Clone the project
2. Move to the backend directory
   ```cd backend```
3. Create a file named ```.env``` in the current directory and add all the environmental variables to it.
4. Use the following command to start the server ```go run main.go```
 
### 6. Steps to run the project (Frontend)
1. Clone the project
2. Move to the frontend directory ```cd front-end```
3. Give ```npm install``` to install all dependencies
4. Give ```npm start``` to start the React app

### 7. Steps to run the whole project in a Docker container
1. Clone the project
2. Move to the main directory where the Dockerfile is located (gatorexchange)
3. Build the docker image using the following command
``` docker build . -t gatorexchange```
4. After the building the image, use the following command to run it in a container
``` docker run -p 3000:8080 gatorexchange```

### 8. Deployment
1. The docker image has been deployed in Heroku
2. https://gatorexchange.herokuapp.com
