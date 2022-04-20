# Sprint 4

## Tasks Accomplished

### 1. Sprint Board

 - All the backend tasks were properly managed in the Sprint 4 board and the proper lifecycle has been followed

### 2. Backend Functionalities Implemented


### 3. Frontend Functionalities Implemented


### 4. Documentation

 - Wiki has been updated with all the new backend APIs written. Proper video working of each API has also been added (https://github.com/Blackdeathanton/gatorexchange/wiki/Backend)

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
