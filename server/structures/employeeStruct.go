package structures

type Employee struct {
	Id        int    `json:"id"`
	Uuid      string `json:"uuid"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	Dept      int    `json:"dept"`
	CreatedBy int    `json:"created_by"`
	CreatedAt string `json:"createdAt"`
}
