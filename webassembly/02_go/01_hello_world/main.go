package main

import "syscall/js"

// 定义内部方法 hello
func hello(this js.Value, args []js.Value) any {
	return "Hello " + args[0].String()
}

func main() {
	// 将 Go 内部的 hello 方法挂在到 window.hello 上
	js.Global().Set("hello", js.FuncOf(hello))

	// 阻塞 Go 的主线程，防止主线程在 hello 产生的协程执行完之前就退出了
	ch := make(chan string, 0)
	<-ch
}
