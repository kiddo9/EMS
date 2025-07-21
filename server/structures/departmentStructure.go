package structures

type Department struct {
	Id            int    `json:"id"`
	Department    string `json:"department"`
	Description   string `json:"description"`
	Manager       int    `json:"manager"`
	Is_active     int    `json:"is_active"`
	Total_members int    `json:"total_members"`
	Created_at    string `jaon:"created_at"`
	Created_by    int    `jaon:"created_by"`
}
