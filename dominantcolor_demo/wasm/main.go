package main

import (
	"bytes"
	"fmt"
	"image/jpeg"
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

func imageCrop(this js.Value, args []js.Value) interface{} {
	byteArray := js.Global().Get("Uint8Array").New(args[0])
	buffer := make([]byte, byteArray.Length())
	js.CopyBytesToGo(buffer, byteArray)

	size := CropSize{
		StartX: args[1].Int(),
		StartY: args[2].Int(),
		Width:  args[3].Int(),
		Height: args[4].Int(),
	}

	img, err := ConvertBytesToImage(buffer)

	if err != nil {
		println(err.Error())
		return nil
	}

	image, err2 := ImageCrop(img, size)

	if err2 != nil {
		println(err2.Error())
		return nil
	}

	fmt.Printf("width = %d height = %d", image.Bounds().Dx(), image.Bounds().Dy())

	var buf bytes.Buffer

	err3 := jpeg.Encode(&buf, image, nil)

	if err3 != nil {
		println(err3.Error())
		return nil
	}

	return bytesToJSValue(buf.Bytes())
}

func bytesToJSValue(data []byte) js.Value {
	// 创建一个 ArrayBuffer 对象
	arrayBuffer := js.Global().Get("ArrayBuffer").New(len(data))
	// 获取 ArrayBuffer 的内存指针
	ptr := js.Global().Get("Uint8Array").New(arrayBuffer)
	// 将 Go 字节切片的数据复制到 ArrayBuffer 的内存中
	js.CopyBytesToJS(ptr, data)
	// 返回 ArrayBuffer 对象
	return arrayBuffer
}

func main() {
	js.Global().Set("getDominantColor", js.FuncOf(getDominantColor))
	js.Global().Set("imageCrop", js.FuncOf(imageCrop))
	select {}
}
