# Sprint 3

## Tasks Accomplished

### 1. Sprint Board

 - All the backend tasks were properly managed in the Sprint 3 board and the proper lifecycle has been followed
 - All the frontend development tasks were managed using the Sprint 3 board under Projects tab. The proper lifecycle of issue creation, development, updating progress state, linking pull request with tasks, reviewing and merging code and pushing tasks to Done was followed

### 2. Backend Functionalities Implemented

 - Search, Filter APIs for questions, questions with tags, and searched questions has been implemented
 - User authentication APIs has been implemented
 - Create, Update, Delete Tags API has been implemented
 - Upvotes and Downvotes APIs has been implemented

### 3. Frontend Functionalities Implemented
 - Implemented user authentication functionality and integrated it with backend using appropriate request headers
 - Integrated search functionality with backend API to filter questions with given keyword
 - Implemented filter, sort options for filtering questions as well as filter using tags option in question list page
 - Developed and integrated all tags view page along with questions count under each tag
 - Integrated upvote and downvote with backend, along with user auth checks for both answers and questions
 - Account creation, login and logout functionalities implemented and integrated with backend
 - Option to view questions under a tag from a question card in home page
 - Added TEST cases for every feature/functionality implemented and integrated in Sprint 3 in the frontend

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
