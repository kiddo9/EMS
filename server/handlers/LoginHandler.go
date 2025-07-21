package handlers

import (
	"EMS_server/config"
	"EMS_server/structures"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func Authentication(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)

	if err != nil {
		log.Fatalln("unable to read data", err)
		return
	}

	email := string(body)
	var exists bool

	err = config.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM employees WHERE email = ?)", email).Scan(&exists)

	if err != nil {
		log.Fatalln("unable to query db row", err)
		return
	}

	if !exists {
		response := structures.Message{Status: "error", Messages: "invalid email"}
		json.NewEncoder(w).Encode(response)
	}

	response := structures.Message{Status: "success", Messages: "valid email"}
	json.NewEncoder(w).Encode(response)
}
