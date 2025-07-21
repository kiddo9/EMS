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

func CreateDepartment(w http.ResponseWriter, r *http.Request) {
	requestBody, err := io.ReadAll(r.Body)

	if err != nil {
		log.Fatalln("No body was found", err)
		return
	}

	var department structures.Department

	err = json.Unmarshal(requestBody, &department)

	if err != nil {
		log.Fatalln("unable to convert json body to go syntax", err)
		return
	}

	if department.Department == "" || department.Description == "" || department.Manager <= 0 {
		response := structures.Message{Status: "error", Messages: "please enter all info"}
		err = json.NewEncoder(w).Encode(response)

		if err != nil {
			log.Fatalln("unable to encode response", err)
		}
		return
	}

	_, err = config.Db.Exec("INSERT INTO department (department, description, manager, is_active, total_members, created_by, updated_by) VALUES (?,?,?,?,?,?,?)", department.Department, department.Description, department.Manager, department.Is_active, department.Total_members, 1, 1)

	if err != nil {
		log.Fatalln("unable to exec db command", err)
		return
	}

	message := fmt.Sprintf("%v has been created", department.Department)
	response := structures.Message{Status: "success", Messages: message}

	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode response", err)
	}
}

func GetDepartments(w http.ResponseWriter, r *http.Request) {
	var department []structures.Department
	rows, err := config.Db.Query("SELECT id, department, description, manager, is_active, total_members, updated_at, updated_by FROM department")

	if err != nil {
		log.Fatalln("unable query db", err)
		return
	}

	for rows.Next() {
		var dept structures.Department
		err := rows.Scan(&dept.Id, &dept.Department, &dept.Description, &dept.Manager, &dept.Is_active, &dept.Total_members, &dept.Created_at, &dept.Created_by)

		if err != nil {
			log.Fatalln("unable to scan rows", err)
			return
		}

		department = append(department, dept)
	}

	err = json.NewEncoder(w).Encode(department)

	if err != nil {
		log.Fatalln("unable to encode response", err)
	}
}

func GetDepartmentsById(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	uuid := queryParams.Get("uuid")

	var departmentData structures.Department
	err := config.Db.QueryRow("SELECT id, department, description, manager, is_active, total_members, updated_at, updated_by  FROM department WHERE id = ?", uuid).
		Scan(&departmentData.Id, &departmentData.Department, &departmentData.Description, &departmentData.Manager, &departmentData.Is_active, &departmentData.Total_members, &departmentData.Created_at, &departmentData.Created_by)

	if err != nil {
		log.Fatal("unable to query db or user not found", err)
		return
	}

	err = json.NewEncoder(w).Encode(departmentData)
	if err != nil {
		log.Fatal("unable to encode respose", err)
		return
	}
}

func UpdateDepartmentDetails(w http.ResponseWriter, r *http.Request) {
	queryParam := r.URL.Query()
	uuid := queryParam.Get("uuid")

	requestBody := r.Body
	defer requestBody.Close()

	body, err := io.ReadAll(requestBody)

	if err != nil {
		log.Fatal("unable to read request body", err)
	}

	var departmentData structures.Department
	err = json.Unmarshal(body, &departmentData)

	if err != nil {
		log.Fatalln("unable to marshal body", err)
	}

	_, err = config.Db.Exec("UPDATE department SET department = ?, manager = ?, description = ? WHERE id = ?", departmentData.Department, departmentData.Manager, departmentData.Description, uuid)

	if err != nil {
		log.Fatalln("unable to update db", err)
	}

	response := structures.Message{Status: "success", Messages: "info updated"}
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode reqponse", err)
	}
}

func DeleteDepartment(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	uuid := queryParams.Get("uuid")

	fmt.Println(uuid)

	var exist bool
	err := config.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM department WHERE id = ?)", uuid).Scan(&exist)

	if err != nil {
		log.Fatalln("unable to query Db", err)
	}

	if !exist {
		log.Fatalln("user not found")
		return
	}

	_, err = config.Db.Exec("DELETE FROM department WHERE id = ?", uuid)

	if err != nil {
		log.Fatalln("unable to perform delete request", err)
	}

	response := structures.Message{Status: "success", Messages: "data deleted"}
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode reqponse", err)
	}
}
