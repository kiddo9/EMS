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

func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Print("ok")
	json.NewEncoder(w).Encode("welcometo the index api")
}

// handler for creating a new employee
func AddNewEmploayee(w http.ResponseWriter, r *http.Request) {

	responseBody := r.Body
	body, err := io.ReadAll(responseBody)

	if err != nil {
		http.Error(w, "could not read data", http.StatusBadRequest)
		log.Fatal(err)
		return
	}

	var employeeData structures.Employee

	err = json.Unmarshal(body, &employeeData)
	if err != nil {
		http.Error(w, "unexpected request format", http.StatusBadRequest)
		log.Fatal(err)
		return
	}

	generateUuid := fmt.Sprintf("%x", employeeData.Email)
	fmt.Println(generateUuid)

	if config.Db == nil {
		http.Error(w, "Database not initialized", http.StatusInternalServerError)
		log.Fatal(err)
		return
	}

	var DoesUserExist bool
	err = config.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM employees WHERE email = ?)", employeeData.Email).Scan(&DoesUserExist)

	if err != nil {
		http.Error(w, "Failed to check user", http.StatusInternalServerError)
		log.Fatal("error occoured", err)
	}

	if DoesUserExist {
		response := structures.Message{Status: "error", Messages: "This user already exist"}
		json.NewEncoder(w).Encode(response)
		return
	}

	_, err = config.Db.Exec("INSERT INTO employees (uuid, firstName, lastName, email, role, dept, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", generateUuid, employeeData.FirstName, employeeData.LastName, employeeData.Email, employeeData.Role, employeeData.Dept, 1, 1)

	if err != nil {
		http.Error(w, "unable to add employee", http.StatusInternalServerError)
		log.Fatalln("unable to add employees", err)
		return
	}

	successMessage := fmt.Sprintf("%v %v has been added", employeeData.FirstName, employeeData.LastName)
	response := structures.Message{Status: "success", Messages: successMessage}

	fmt.Println(response)
	json.NewEncoder(w).Encode(response)
}

func GetEmployeeList(w http.ResponseWriter, r *http.Request) {
	var employeeList []structures.Employee
	rows, err := config.Db.Query("SELECT id, uuid, firstName, lastName, email, role, dept, created_by, CreatedAt FROM employees")

	if err != nil {
		log.Fatal("could not uptain data: ", err)
		return
	}

	for rows.Next() {
		var emp structures.Employee
		err := rows.Scan(&emp.Id, &emp.Uuid, &emp.FirstName, &emp.LastName, &emp.Email, &emp.Role, &emp.Dept, &emp.CreatedBy, &emp.CreatedAt)
		if err != nil {
			http.Error(w, "Error scanning data", http.StatusInternalServerError)
			log.Println("Scan error:", err)
			return
		}
		employeeList = append(employeeList, emp)
	}

	fmt.Print(employeeList)
	err = json.NewEncoder(w).Encode(employeeList)

	if err != nil {
		log.Fatal("could not encode to json: ", err)
		return
	}
}

func GetEmployeeById(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	uuid := query.Get("uuid")

	var employeeData structures.Employee
	err := config.Db.QueryRow("SELECT uuid, firstName, lastName, email, role, dept FROM employees WHERE uuid = ?", uuid).
		Scan(&employeeData.Uuid, &employeeData.FirstName, &employeeData.LastName, &employeeData.Email, &employeeData.Role, &employeeData.Dept)

	if err != nil {
		log.Fatal("unable to query db or user not found", err)
		return
	}
	fmt.Println(employeeData)

	err = json.NewEncoder(w).Encode(employeeData)
	if err != nil {
		log.Fatal("unable to encode respose", err)
		return
	}
}

func UpdateEmployeeDetails(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	uuid := queryParams.Get("uuid")

	requestBody := r.Body
	defer requestBody.Close()

	body, err := io.ReadAll(requestBody)

	if err != nil {
		log.Fatal("unable to read request body", err)
	}
	fmt.Println(string(body))

	var employeeData structures.Employee
	err = json.Unmarshal(body, &employeeData)

	if err != nil {
		log.Fatalln("unable to marshal body", err)
	}

	_, err = config.Db.Exec("UPDATE employees SET firstName = ?, lastName = ?, email = ?, role = ?, dept = ? WHERE uuid = ?", employeeData.FirstName, employeeData.LastName, employeeData.Email, employeeData.Role, employeeData.Dept, uuid)

	if err != nil {
		log.Fatalln("unable to update db", err)
	}

	response := structures.Message{Status: "success", Messages: "info updated"}
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode reqponse", err)
	}
}

func DeleteEmployee(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	uuid := queryParams.Get("uuid")

	var exist bool
	err := config.Db.QueryRow("SELECT EXISTS(SELECT 1 FROM employees WHERE uuid = ?)", uuid).Scan(&exist)

	if err != nil {
		log.Fatalln("unable to query Db", err)
	}

	if !exist {
		log.Fatalln("user not found")
		return
	}

	_, err = config.Db.Exec("DELETE FROM employees WHERE uuid = ?", uuid)

	if err != nil {
		log.Fatalln("unable to perform delete request", err)
	}

	response := structures.Message{Status: "success", Messages: "data deleted"}
	err = json.NewEncoder(w).Encode(response)

	if err != nil {
		log.Fatalln("unable to encode reqponse", err)
	}
}
