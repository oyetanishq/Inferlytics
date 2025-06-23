package model

import "time"

type Sale struct {
	ID                   uint      `gorm:"primaryKey" json:"id"`
	Date                 time.Time `gorm:"not null" json:"date" binding:"required"`
	Category             string    `gorm:"not null" json:"category" binding:"required"`
	Product              string    `gorm:"not null" json:"product" binding:"required"`
	SalesAmount          float64   `gorm:"not null" json:"sales_amount" binding:"required,gte=0"`
	Quantity             int       `gorm:"not null" json:"quantity" binding:"required,gte=0"`
	Region               string    `gorm:"not null" json:"region" binding:"required"`
	SalesPerson          string    `gorm:"not null" json:"salesperson" binding:"required"`
	CustomerSatisfaction float64   `gorm:"not null" json:"customer_satisfaction" binding:"required,gte=0,lte=5"`
}
