package auth

import (
	authController "backend/controller/auth"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(r *gin.RouterGroup) {
	authGroup := r.Group("auth")
	{
		authGroup.POST("register", authController.RegisterUser)
		authGroup.POST("login", authController.LoginUser)
	}
}