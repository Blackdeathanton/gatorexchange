package config

import (
	"context"
	"fmt"
	"log"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TokenDetails struct {
	Email    string
	Username string
	Id       string
	jwt.StandardClaims
}

var userCollection *mongo.Collection = GetCollection(MClient, "users")
var jwtKey string = GetJWTKey()

/*
	This function is responsible for generating the detailed
	token and the refresh token
*/
func GenerateAllTokens(email string, username string, id string) (token string, refreshToken string, err error) {
	signedClaims := &TokenDetails{
		Email:    email,
		Username: username,
		Id:       id,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}

	refreshClaims := &TokenDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
		},
	}

	signedToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, signedClaims).SignedString([]byte(jwtKey))
	if err != nil {
		log.Panic(err)
		return
	}

	signedRefreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(jwtKey))
	if err != nil {
		log.Panic(err)
		return
	}

	return signedToken, signedRefreshToken, err
}

/*
	This method is responsible for validating the token

*/
func ValidateToken(signedToken string) (claims *TokenDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&TokenDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		},
	)

	if err != nil {
		return
	}

	claims, ok := token.Claims.(*TokenDetails)
	if !ok || claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "Expired"
		fmt.Println("Token expired")
		return
	}

	return claims, msg
}

/*
	This function is responsible for updating the tokens
	in the database
*/
func UpdateAllTokens(signedToken string, signedRefreshToken string, userId string) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var updateObj primitive.D

	updateObj = append(updateObj, bson.E{"token", signedToken})
	updateObj = append(updateObj, bson.E{"refreshtoken", signedRefreshToken})

	updateTime := time.Now()
	updateObj = append(updateObj, bson.E{"updatedtime", updateTime})

	upsert := true

	objID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		log.Panic(err)
		return
	}

	filter := bson.M{"id": objID}
	opt := options.UpdateOptions{
		Upsert: &upsert,
	}

	_, err = userCollection.UpdateOne(
		ctx,
		filter,
		bson.D{
			{"$set", updateObj},
		},
		&opt,
	)
	defer cancel()

	if err != nil {
		log.Panic(err)
		return
	}

	return
}
