package main

import (
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func openDb() *gorm.DB {
	dsn := "root:123456@tcp(localhost:3306)/c2b_baffle?charset=utf8&parseTime=True&loc=Local"

	var db *gorm.DB
	var err error
	if db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{}); err != nil {
		log.Fatal(err)
	}
	return db
}

type AppChannel struct {
	ID        uint      `json:"id" gorm:"column:id;primaryKey"`
	MerNo     string    `json:"merNo"`
	AppId     string    `json:"appId"`
	AppName   string    `json:"appName"`
	Reserved1 string    `json:"reserved1"`
	Reserved2 string    `json:"reserved2"`
	Reserved3 string    `json:"reserved3"`
	CreatedAt time.Time `json:"createTime" gorm:"column:create_time"`
	UpdatedAt time.Time `json:"updateTime" gorm:"column:update_time"`
	DelFlag   string    `json:"delFlag"`
	Remarks   string    `json:"remarks,omit"`
	// DeletedAt gorm.DeletedAt `json:"omit" gorm:"index"`
	// Name string `json:"ommit"`
}

func (AppChannel) TableName() string {
	return "c2b_app_channel"
}

func httpServe(db *gorm.DB) {
	appChannel := AppChannel{
		MerNo:   "test001",
		AppId:   "test001001",
		AppName: "测试001",
		DelFlag: "0",
	}

	result := db.Create(&appChannel)
	log.Printf("%d %v", appChannel.ID, result)
}

func main() {
	db := openDb()
	httpServe(db)

}
