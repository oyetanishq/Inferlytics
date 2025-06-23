package database

import (
	"log"

	"backend/model"
)

func Migrate() {
    err := DB.AutoMigrate(&model.User{}, &model.Sale{})
    if err != nil {
        log.Fatalf("Migration failed: %v", err)
    }
}