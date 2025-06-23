package sale

import (
	"backend/database"
	"backend/model"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"os"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
    c.JSON(http.StatusCreated, gin.H{"message": "GET /sale/health-check"})
}

func GetAllSales(c *gin.Context) {
	var sales []model.Sale
	if err := database.DB.Find(&sales).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(sales) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No sales found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sales": sales})
}

func UploadCSV(c *gin.Context) {
	file, err := os.Open("./data/sample_sales_data.csv")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)

	// Read header
	records, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(records) < 2 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "CSV contains no data rows"})
		return
	}

	// Skip header
	for i, row := range records[1:] {
		if len(row) != 8 {
			fmt.Printf("Skipping invalid row %d: %+v\n", i+2, row)
			continue
		}

		// Parse fields
		date, err := time.Parse("2006-01-02", row[0])
		if err != nil {
			fmt.Printf("Invalid date at row %d: %v\n", i+2, err)
			continue
		}

		salesAmount, err := strconv.ParseFloat(row[3], 64)
		if err != nil {
			fmt.Printf("Invalid Sales_Amount at row %d: %v\n", i+2, err)
			continue
		}

		quantity, err := strconv.Atoi(row[4])
		if err != nil {
			fmt.Printf("Invalid Quantity at row %d: %v\n", i+2, err)
			continue
		}

		customerSatisfaction, err := strconv.ParseFloat(row[7], 64)
		if err != nil {
			fmt.Printf("Invalid Customer_Satisfaction at row %d: %v\n", i+2, err)
			continue
		}

		sale := model.Sale{
			Date:                 date,
			Category:             row[1],
			Product:              row[2],
			SalesAmount:          salesAmount,
			Quantity:             quantity,
			Region:               row[5],
			SalesPerson:          row[6],
			CustomerSatisfaction: customerSatisfaction,
		}

		if err := database.DB.Create(&sale).Error; err != nil {
			fmt.Printf("Failed to insert row %d: %v\n", i+2, err)
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "POST /sale/uploaded"})
}
