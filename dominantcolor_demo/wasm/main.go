package main

import (
	"syscall/js"

	"github.com/johniexu/dominantcolor2"
)

func getDominantColor(this js.Value, args []js.Value) interface{} {
	// 将ArrayBuffer转换为字节数组
	byteArray := js.Global().Get("Uint8Array").New(args[0])
	buffer := make([]byte, byteArray.Length())
	js.CopyBytesToGo(buffer, byteArray)
	image, err := ConvertBytesToImage(buffer)
	if err != nil {
		println(err.Error())
		return nil
	}
	color := dominantcolor2.Hex(dominantcolor2.Find(image))
	println("success")
	return color
}

func main() {
	js.Global().Set("getDominantColor", js.FuncOf(getDominantColor))
	select {}
}
