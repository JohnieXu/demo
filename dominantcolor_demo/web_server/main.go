package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	// 获取当前项目的绝对路径
	dir, err := filepath.Abs("./build")
	if err != nil {
		log.Fatal(err)
	}

	// 创建一个文件服务器处理器
	fileServer := http.FileServer(http.Dir(dir))

	// 将文件服务器处理器注册到根路径
	http.Handle("/", fileServer)

	// 启动Web服务并监听8082端口
	log.Println("Server started on http://localhost:8082")
	log.Fatal(http.ListenAndServe(":8082", nil))
}
