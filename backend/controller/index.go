package controller

import (
	"github.com/gin-gonic/gin"
)

func Home (c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Welcome to the Simple Todo API",
	})
}