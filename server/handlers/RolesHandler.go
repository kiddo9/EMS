package handlers

import (
	"EMS_server/config"
	"EMS_server/structures"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

func CreateRole(w http.ResponseWriter, r *http.Request) {
	requestBody := r.Body
	body, err := io.ReadAll(requestBody)

	if err != nil {
		log.Fatalln("unable to ready data", err)
		return
	}

	var roles structures.Roles

	err = json.Unmarshal(body, &roles)

	if err != nil {
		log.Fatalln("unable to unmarshal body", err)
		return
	}

	_, err = config.Db.Exec("INSERT INTO roles (title, created_by, updated_by) VALUES (?, ?, ?)", roles.Title, 1, 1)

	if err != nil {
		log.Fatalln("unable to create role body", err)
		return
	}

	successMessage := fmt.Sprintf("%v has been added", roles.Title)
	response := structures.Message{Status: "success", Messages: successMessage}

	fmt.Println(response)
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode response", err)
		return
	}
}

func GetAllRoles(w http.ResponseWriter, r *http.Request) {
	var allRoles []structures.Roles

	rows, err := config.Db.Query("SELECT id, title, updatedAt, updated_by FROM roles")

	if err != nil {
		log.Fatalln("unable to run command", err)
		return
	}

	for rows.Next() {
		var role structures.Roles
		err := rows.Scan(&role.Id, &role.Title, &role.Date, &role.CreatedBy)

		if err != nil {
			log.Println("Scan error:", err)
			return
		}

		allRoles = append(allRoles, role)
	}

	fmt.Println(allRoles)
	err = json.NewEncoder(w).Encode(allRoles)

	if err != nil {
		log.Println("unable to encode info", err)
		return
	}
}

func GetRoleByID(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	uuid := query.Get("uuid")

	var roleData structures.Roles
	err := config.Db.QueryRow("SELECT id, title, updatedAt, updated_by FROM roles WHERE id = ?", uuid).
		Scan(&roleData.Id, &roleData.Title, &roleData.Date, &roleData.CreatedBy)

	if err != nil {
		log.Fatal("unable to query db or user not found", err)
		return
	}

	err = json.NewEncoder(w).Encode(roleData)
	if err != nil {
		log.Fatal("unable to encode respose", err)
		return
	}
}

func UpdateRole(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	uuid := queryParams.Get("uuid")

	requestBody := r.Body
	defer requestBody.Close()

	body, err := io.ReadAll(requestBody)

	if err != nil {
		log.Fatal("unable to read request body", err)
	}

	var roleData structures.Roles
	err = json.Unmarshal(body, &roleData)

	if err != nil {
		log.Fatalln("unable to marshal body", err)
	}

	_, err = config.Db.Exec("UPDATE roles SET title = ? WHERE id = ?", roleData.Title, uuid)

	if err != nil {
		log.Fatalln("unable to update db", err)
	}

	response := structures.Message{Status: "success", Messages: "info updated"}
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode reqponse", err)
	}
}

func DeleteRole(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	uuid := queryParams.Get("uuid")

	var exist bool
	err := config.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM roles WHERE id = ?)", uuid).Scan(&exist)

	if err != nil {
		log.Fatalln("unable to query Db", err)
	}

	if !exist {
		log.Fatalln("user not found")
		return
	}

	_, err = config.Db.Exec("DELETE FROM roles WHERE id = ?", uuid)

	if err != nil {
		log.Fatalln("unable to perform delete request", err)
	}

	response := structures.Message{Status: "success", Messages: "data deleted"}
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode reqponse", err)
	}
}
