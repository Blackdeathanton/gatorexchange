package config

import (
	"log"
	"os"

	"github.com/joho/gotdotenv"
)

func GetMongoURI() string {
	err := gotdotenv.Load()

	if err != nil {
		log.Fatal("An error occurred while loading .env file")
	}

	return os.Getenv("MONGOURI")
}
