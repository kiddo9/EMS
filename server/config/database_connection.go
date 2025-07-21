package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"

	"github.com/joho/godotenv"
)

var Db *sql.DB

func DbConnection() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Unable to load env file")
		return
	}

	db_username := os.Getenv("DB_USERNAME")
	db_password := os.Getenv("DB_PASSWORD")
	db_name := os.Getenv("DB_NAME")
	db_port := os.Getenv("DB_PORT")
	db_host := os.Getenv("DB_HOST")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", db_username, db_password, db_host, db_port, db_name)

	Db, err = sql.Open("mysql", dsn)

	if err != nil {
		log.Fatalf("Unable to connect to the database %v", err)
		return
	}

	err = Db.Ping()

	if err != nil {
		log.Fatalf("Unable to ping database %v", err)
		return
	}

	log.Println("✅ Database connection successful")
}
