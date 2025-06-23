package sale

import (
	saleController "backend/controller/sale"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupSaleRoutes(r *gin.RouterGroup) {
	saleGroup := r.Group("sale")
	saleGroup.Use(middleware.AuthMiddleware())
	{
		saleGroup.GET("/all", saleController.GetAllSales)
		saleGroup.GET("health-check", saleController.HealthCheck)
	}
}