// 基于 Gorm 的 MySQL 数据库基本 CRUD 实现
package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func openDb() *gorm.DB {
	dsn := "root:123456@tcp(localhost:3306)/c2b_baffle?charset=utf8&parseTime=True&loc=Local"

	var db *gorm.DB
	var err error
	var sqlDb *sql.DB
	// if db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{}); err != nil {
	// 	log.Fatal(err)
	// }

	// 使用现有 mysql 连接来初始化
	sqlDb, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	if db, err = gorm.Open(mysql.New(mysql.Config{
		Conn: sqlDb,
	})); err != nil {
		log.Fatal(err)
	}
	return db
}

func struct2byte(data interface{}) (res []byte, err error) {
	return json.Marshal(data)
}

type BaseResponse struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

type ResponseWriteWrapper struct {
	http.ResponseWriter
}

func (w ResponseWriteWrapper) WriteSuccess(data interface{}) {
	w.ResponseWriter.Header().Add("Content-Type", "application/json")
	res, _ := struct2byte(BaseResponse{
		Code: 0,
		Msg:  "ok",
		Data: data,
	})
	w.ResponseWriter.Write(res)
}

func (w ResponseWriteWrapper) WriteError(err error) {
	w.ResponseWriter.Header().Add("Content-Type", "application/json")
	log.Println(err)
	res, _ := struct2byte(BaseResponse{
		Code: 1,
		Msg:  err.Error(),
		Data: nil,
	})
	w.ResponseWriter.Write(res)
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
	DelFlag   string    `json:"-"`
	Remarks   string    `json:"remarks"`
	// DeletedAt gorm.DeletedAt `json:"omit" gorm:"index"`
	// Name string `json:"ommit"`
}

type AppList []AppChannel

func (AppChannel) TableName() string {
	return "c2b_app_channel"
}

func httpServe(db *gorm.DB) {

	// 列表
	http.HandleFunc("/app_channel/list", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}
		result := &AppList{}
		// Find 后面为内联过滤条件，不传递则表示查询所有
		// 查询所有记录
		db.Find(result, "del_flag != ?", "1")

		// stmt := db.Session(&gorm.Session{DryRun: true}).Find(result, "del_flag != ?", "1").Statement
		// println(stmt.SQL.String())
		// println(stmt.Vars)

		sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
			return tx.Find(result, "del_flag != ?", "1")
		})
		println(sql)

		rw.WriteSuccess(result)
	})

	// 新增
	http.HandleFunc("/app_channel/save", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)

		if err != nil {
			rw.WriteError(err)
			return
		}

		var appChannel AppChannel

		json.Unmarshal(body, &appChannel)

		appChannel.DelFlag = "0"

		// 注意: 必须传递指针，不然会报错
		res := db.Create(&appChannel)

		sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
			return tx.Create(&appChannel)
		})
		println(sql)

		if res.Error != nil {
			rw.WriteError(res.Error)
			return
		}

		if res.RowsAffected != 1 {
			rw.WriteError(errors.New("新增失败"))
			return
		}

		rw.WriteSuccess(appChannel)
	})

	// 物理删除
	http.HandleFunc("/app_channel/remove", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			rw.WriteError(err)
			return
		}

		type RequestParam struct {
			Id uint `json:"id"`
		}

		var requestParam = RequestParam{}
		if err := json.Unmarshal(body, &requestParam); err != nil {
			rw.WriteError(err)
			return
		}

		var appChannel = AppChannel{
			ID: requestParam.Id,
		}

		// 根据 appChannel 的 ID 进行删除
		res := db.Delete(&appChannel)

		sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
			return tx.Delete(&appChannel)
		})
		println(sql)

		// 或者，根据主键删除
		// db.Delete(&appChannel, requestParam.Id)

		if res.Error != nil {
			rw.WriteError(res.Error)
			return
		}

		if res.RowsAffected != 1 {
			rw.WriteError(errors.New("删除失败"))
			return
		}

		rw.WriteSuccess(nil)

	})

	// 逻辑删除
	http.HandleFunc("/app_channel/delete", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			rw.WriteError(err)
			return
		}

		type RequestParam struct {
			Id uint `json:"id"`
		}

		var requestParam = RequestParam{}
		err = json.Unmarshal(body, &requestParam)
		if err != nil {
			rw.WriteError(err)
			return
		}

		var appChannel = AppChannel{ID: requestParam.Id}

		// 更新 ID 登录 appChannel.ID 记录的 del_flag 字段值为 1
		res := db.Model(&appChannel).Update("del_flag", "1")

		sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
			return tx.Model(&appChannel).Update("del_flag", "1")
		})
		println(sql)

		if res.Error != nil {
			rw.WriteError(res.Error)
			return
		}

		if res.RowsAffected != 1 {
			rw.WriteError(errors.New("标记删除失败：记录不存在或已被标记删除"))
			return
		}

		rw.WriteSuccess(nil)

	})

	// 更新
	http.HandleFunc("/app_channel/update", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			rw.WriteError(err)
			return
		}

		type RequestParam struct {
			Id      int    `json:"id"`
			MerNo   string `json:"merNo"`
			AppId   string `json:"appId"`
			AppName string `json:"appName"`
			Remarks string `json:"remarks"`
		}

		requestParam := RequestParam{}

		err = json.Unmarshal(body, &requestParam)
		if err != nil {
			rw.WriteError(err)
			return
		}

		var appChannel = AppChannel{
			ID:      uint(requestParam.Id),
			MerNo:   requestParam.MerNo,
			AppId:   requestParam.AppId,
			AppName: requestParam.AppName,
			Remarks: requestParam.Remarks,
		}

		// 更新 Id 为 appChannel.ID 的记录的 ("mer_no", "app_id", "app_name", "remarks") 字段值
		res := db.Model(&appChannel).Select("mer_no", "app_id", "app_name", "remarks").Updates(&appChannel)

		sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
			return tx.Model(&appChannel).Select("mer_no", "app_id", "app_name", "remarks").Updates(&appChannel)
		})
		println(sql)

		if res.Error != nil {
			rw.WriteError(res.Error)
			return
		}

		if res.RowsAffected != 1 {
			rw.WriteError(errors.New("更新失败"))
			return
		}

		rw.WriteSuccess(nil)
	})

	// 详情
	http.HandleFunc("/app_channel/detail", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			rw.WriteError(err)
			return
		}

		type RequestParam struct {
			Id int `json:"id"`
		}

		requestParam := RequestParam{}

		err = json.Unmarshal(body, &requestParam)
		if err != nil {
			rw.WriteError(err)
			return
		}

		var appChannel = AppChannel{
			ID: uint(requestParam.Id),
		}

		// First 后面为内联过滤条件
		res := db.First(&appChannel, "del_flag != ?", "1")

		sql := db.ToSQL(func(tx *gorm.DB) *gorm.DB {
			return tx.First(&appChannel, "del_flag != ?", "1")
		})
		println(sql)

		if res.Error != nil {
			rw.WriteError(res.Error)
			return
		}

		rw.WriteSuccess(appChannel)

	})

	// 批量逻辑删除（事务）
	http.HandleFunc("/app_channel/delete_batch", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			rw.WriteError(err)
			return
		}

		type RequestParam struct {
			Ids []uint `json:"ids"`
		}
		requestParam := RequestParam{}
		err = json.Unmarshal(body, &requestParam)
		if err != nil {
			rw.WriteError(err)
			return
		}

		if len(requestParam.Ids) == 0 {
			rw.WriteError(errors.New("参数错误"))
			return
		}

		db.Transaction(func(tx *gorm.DB) error {
			var err error
			for _, id := range requestParam.Ids {
				var appChannel = AppChannel{ID: id, DelFlag: "1"}
				// 更新 Id 为 appChannel.ID 的记录的字段 ("del_flag") 值为 1
				res := tx.Model(&appChannel).Select("del_flag").Updates(appChannel)
				if res.Error != nil {
					// 任一记录操作失败会终止循环，返回 err 来回滚事物
					err = res.Error
					break
				}
			}
			// 返回错误让事务自动回滚
			return err
		})

		// TODO: 怎么打印 SQL 语句
		rw.WriteSuccess(nil)

	})

	port := ":3031"
	fmt.Printf("server is running at http://localhost%s\n", port)
	http.ListenAndServe(port, nil)
}

func main() {
	db := openDb()
	httpServe(db)
}
