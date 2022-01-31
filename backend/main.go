package main

import (
	"backend-v1/src/routes"
	"log"
)

func main() {
	log.Println("Logger initialized.")
	log.Fatal(routes.RunAPI("127.0.0.1:8000"))
}
