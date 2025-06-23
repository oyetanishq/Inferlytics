package model

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"not null" json:"name" binding:"required,min=5,max=20"`
	Email    string `gorm:"not null;unique" json:"email" binding:"required,email,min=5,max=30"`
	Password string `gorm:"not null" json:"password" binding:"required,min=8,max=30"`
}
