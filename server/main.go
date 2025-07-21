package main

import (
	"EMS_server/config"
	"EMS_server/routes"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func initialize() {
	config.DbConnection()
}

func main() {
	initialize()
	err := godotenv.Load()

	if err != nil {
		log.Fatal("unable to load env file", err)
		return
	}

	route := routes.Routes()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	err = http.ListenAndServe(":"+port, route)
	if err != nil {
		log.Fatal("sever error", err)
	}
}
