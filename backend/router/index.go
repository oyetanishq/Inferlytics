package router

import (
	"backend/controller"
	authRouter "backend/router/auth"
	saleRouter "backend/router/sale"

	"github.com/gin-gonic/gin"
)

func SetupHomeRoutes(r *gin.Engine) {
    homeGroup := r.Group("/")

	homeGroup.GET("/", controller.Home)

	authRouter.SetupAuthRoutes(homeGroup)
	saleRouter.SetupSaleRoutes(homeGroup)
}