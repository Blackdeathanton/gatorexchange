package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetMongoURI() string {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("An error occurred while loading .env file", err)
	}

	return os.Getenv("MONGOURI")
}

func GetJWTKey() string {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("An error occurred while loading .env file", err)
	}
	return os.Getenv("JWTKEY")
}
