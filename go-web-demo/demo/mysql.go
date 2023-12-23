// 基于原生 SQL 的 MySQL数据库基本 CRUD 实现
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

	_ "github.com/go-sql-driver/mysql"
)

type AppItem struct {
	Id      uint   `json:"id"`
	MerNO   string `json:"merNo"`
	AppId   string `json:"appId"`
	AppName string `json:"appName"`
}

type AppItemAll struct {
	Id         uint      `json:"id"`
	MerNo      string    `json:"merNo"`
	AppId      string    `json:"appId"`
	AppName    string    `json:"appName"`
	Reserved1  string    `json:"reserved1"`
	Reserved2  string    `json:"reserved2"`
	Reserved3  string    `json:"reserved3"`
	CreateTime time.Time `json:"createTime"`
	UpdateTime time.Time `Json:"updateTime"`
	DelFlag    string    `json:"-"`
	Remarks    string    `json:"remarks"`
}

type AppList []AppItem

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

func getAppChannelList(db *sql.DB) (result AppList, err error) {
	row, err := db.Query("SELECT mer_no,app_id,app_name,id FROM c2b_app_channel WHERE del_flag != 1 ORDER BY id DESC")
	if err != nil {
		return nil, err
	}
	defer row.Close()

	var list AppList

	for row.Next() {
		var col1 string
		var col2 string
		var col3 string
		var col4 uint

		if err = row.Scan(&col1, &col2, &col3, &col4); err != nil {
			fmt.Println("scan fail", err)
			return nil, err
		}
		list = append(list, AppItem{
			Id:      col4,
			MerNO:   col1,
			AppId:   col2,
			AppName: col3,
		})
	}

	// st, err := db.Prepare("SELECT * FROM c2b_app_channel")
	// if err != nil {
	// 	return nil, err
	// }
	// result, err = st.Exec()
	// if err != nil {
	// 	return nil, err
	// }
	return list, nil
}

func struct2byte(data interface{}) (res []byte, err error) {
	return json.Marshal(data)
}

func writeError(w http.ResponseWriter, err error) {
	res, _ := struct2byte(BaseResponse{
		Code: 1,
		Msg:  err.Error(),
		Data: nil,
	})
	w.Header().Add("Content-Type", "application/json")
	w.Write(res)
}

func writeSuccess(w http.ResponseWriter, data interface{}) {
	w.Header().Add("Content-Type", "application/json")
	res, _ := struct2byte(BaseResponse{
		Code: 0,
		Msg:  "ok",
		Data: data,
	})

	w.Write(res)
}

func httpServe(db *sql.DB) {

	// 列表
	http.HandleFunc("/app_channel/list", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}
		result, err := getAppChannelList(db)
		if err != nil {
			rw.WriteError(err)
			return
		}
		rw.WriteSuccess(result)
	})

	// 新增
	http.HandleFunc("/app_channel/save", func(w http.ResponseWriter, r *http.Request) {
		rw := ResponseWriteWrapper{ResponseWriter: w}

		body, err := io.ReadAll(r.Body)

		var appItem AppItemAll

		json.Unmarshal(body, &appItem)

		appItem.CreateTime = time.Now()
		appItem.UpdateTime = time.Now()
		appItem.DelFlag = "0"

		st, err := db.Prepare("INSERT INTO c2b_app_channel (mer_no, app_id, app_name, del_flag, create_time, update_time, remarks) VALUES (?,?,?,?,?,?,?)")

		result, err := st.Exec(appItem.MerNo, appItem.AppId, appItem.AppName, appItem.DelFlag, appItem.CreateTime, appItem.UpdateTime, appItem.Remarks)
		if err != nil {
			rw.WriteError(err)
			return
		}

		id, _ := result.LastInsertId()
		appItem.Id = uint(id)

		rw.WriteSuccess(appItem)
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

		st, err := db.Prepare("DELETE FROM c2b_app_channel WHERE id = ?")
		if err != nil {
			rw.WriteError(err)
			defer st.Close()
			return
		}

		result, err := st.Exec(requestParam.Id)
		if err != nil {
			rw.WriteError(err)
			return
		}

		if affected, _ := result.RowsAffected(); affected > 1 {
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

		st, err := db.Prepare("UPDATE c2b_app_channel SET del_flag = 1 WHERE id = ?")
		if err != nil {
			rw.WriteError(err)
			defer st.Close()
			return
		}

		result, err := st.Exec(requestParam.Id)
		if err != nil {
			rw.WriteError(err)
			return
		}

		affected, _ := result.RowsAffected()

		if affected != 1 {
			rw.WriteError(errors.New("删除失败"))
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

		st, err := db.Prepare("UPDATE c2b_app_channel SET mer_no = ?, app_id = ?, app_name = ?, remarks = ? where id = ?")
		if err != nil {
			rw.WriteError(err)
			return
		}

		result, err := st.Exec(requestParam.MerNo, requestParam.AppId, requestParam.AppName, requestParam.Remarks, requestParam.Id)
		if err != nil {
			rw.WriteError(err)
			return
		}
		i, _ := result.RowsAffected()
		if i != 1 {
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

		st, err := db.Prepare("SELECT id,mer_no,app_id,app_name,remarks,create_time,update_time FROM c2b_app_channel WHERE id = ?")
		if err != nil {
			rw.WriteError(err)
			defer st.Close()
			return
		}

		rows, err := st.Query(requestParam.Id)
		if err != nil {
			rw.WriteError(err)
			return
		}

		var appItemAll = AppItemAll{}

		var id uint
		var merNo string
		var appId string
		var appName string
		var remarks string
		var createTime time.Time
		var updateTime time.Time

		for rows.Next() {
			rows.Scan(&id, &merNo, &appId, &appName, &remarks, &createTime, &updateTime)
			appItemAll.Id = id
			appItemAll.MerNo = merNo
			appItemAll.AppId = appId
			appItemAll.AppName = appName
			appItemAll.Remarks = remarks
			appItemAll.CreateTime = createTime
			appItemAll.UpdateTime = updateTime
		}

		rw.WriteSuccess(appItemAll)

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

		ctx, err := db.Begin()
		if err != nil {
			rw.WriteError(err)
			return
		}

		if len(requestParam.Ids) == 0 {
			rw.WriteError(errors.New("参数错误"))
			return
		}

		for _, id := range requestParam.Ids {
			result, err := ctx.Exec("UPDATE c2b_app_channel SET del_flag = 1 WHERE id = ?", id)
			if err != nil {
				ctx.Rollback()
				rw.WriteError(err)
				break
			}
			affected, err := result.RowsAffected()
			if err != nil || affected > 1 {
				ctx.Rollback()
				if err == nil {
					rw.WriteError(errors.New(fmt.Sprintf("删除记录 %d 失败", id)))
				} else {
					rw.WriteError(err)
				}
				break
			}
		}

		ctx.Commit()
		rw.WriteSuccess(nil)

	})

	port := ":3030"
	fmt.Printf("server is running at http://localhost%s\n", port)
	http.ListenAndServe(port, nil)
}

func main() {
	fmt.Println("zcy")
	db, err := sql.Open("mysql", "root:123456@tcp(localhost:3306)/c2b_baffle?charset=utf8&parseTime=True&loc=Local")

	if err != nil {
		panic(err)
	}

	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	err = db.Ping()

	if err != nil {
		panic(err)
	}

	fmt.Println("connected")

	httpServe(db)
}
