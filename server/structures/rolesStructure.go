package structures

type Roles struct {
	Id        int    `json:"id"`
	Title     string `json:"title"`
	CreatedBy int    `json:"created_by"`
	Date      string `json:"created_at"`
}
