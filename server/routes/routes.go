package routes

import (
	"EMS_server/handlers"
	"EMS_server/middleware"
	"net/http"
)

func Routes() http.Handler {

	mux := http.NewServeMux()

	mux.HandleFunc("GET /", handlers.Index)
	mux.HandleFunc("POST /create/employee", handlers.AddNewEmploayee)
	mux.HandleFunc("GET /employees", handlers.GetEmployeeList)
	mux.HandleFunc("GET /employees/id", handlers.GetEmployeeById)
	mux.HandleFunc("PUT /employees/id", handlers.UpdateEmployeeDetails)
	mux.HandleFunc("DELETE /employees/id", handlers.DeleteEmployee)

	mux.HandleFunc("GET /roles", handlers.GetAllRoles)
	mux.HandleFunc("GET /roles/id", handlers.GetRoleByID)
	mux.HandleFunc("POST /create/roles", handlers.CreateRole)
	mux.HandleFunc("PUT /roles/id", handlers.UpdateRole)
	mux.HandleFunc("DELETE /roles/id", handlers.DeleteRole)

	mux.HandleFunc("GET /departments", handlers.GetDepartments)
	mux.HandleFunc("GET /departments/id", handlers.GetDepartmentsById)
	mux.HandleFunc("POST /create/department", handlers.CreateDepartment)
	mux.HandleFunc("PUT /departments/id", handlers.UpdateDepartmentDetails)
	mux.HandleFunc("DELETE /departments/id", handlers.DeleteDepartment)

	mux.HandleFunc("POST /login", handlers.Authentication)

	handler := middleware.CorsMiddleware(mux)

	return handler
}
