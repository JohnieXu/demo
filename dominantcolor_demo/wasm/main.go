package main

import (
	"bytes"
	"fmt"
	"image/jpeg"
	"reflect"
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
	color := dominantcolor2.Find(image)
	colorStr := dominantcolor2.Hex(color)
	println("success")
	return colorStr
}

func getColorPalette(this js.Value, args []js.Value) interface{} {
	println("doing")
	// 将ArrayBuffer转换为字节数组
	byteArray := js.Global().Get("Uint8Array").New(args[0])
	count := args[1].Int()
	buffer := make([]byte, byteArray.Length())
	js.CopyBytesToGo(buffer, byteArray)
	image, err := ConvertBytesToImage(buffer)
	if err != nil {
		println(err.Error())
		return nil
	}
	colors := dominantcolor2.FindN(image, count)
	// 字符串数组方式返回
	colorsArray := js.Global().Get("Array").New((len(colors)))

	for i, color := range colors {
		colorsArray.SetIndex(i, dominantcolor2.Hex(color))
	}

	// 字符串拼接方式返回
	// colorStr := ""
	// for _, color := range colors {
	// 	colorStr += dominantcolor2.Hex(color) + ","
	// }
	// colorStr = colorStr[:len(colorStr)-1]
	println("success")
	return colorsArray
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

/**
*	测试 JS 传递不同数据类型到 Go
* js调用： testValue('aa', 12, true, undefined, null, Symbol(), {}, () => {})
* Go打印：string aa,number <number: 12>,boolean <boolean: true>,undefined <undefined>,null <null>,symbol <symbol>,object <object>,function <function>
**/
func testValue(this js.Value, args []js.Value) interface{} {
	println("testValue start")
	// string number boolean undefined null symbol object function
	fmt.Printf("string %v,number %v,boolean %v,undefined %v,null %v,symbol %v,object %v,function %v \n", args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
	arg0 := args[0].String()
	print("arg0 = ")
	print(arg0, "\n")
	return nil
}

func testValueOne(this js.Value, args []js.Value) interface{} {
	println(("testValueOne start"))
	// println("args[0] value = ", args[0].String(), "type = ", reflect.TypeOf(args[0].String()).Name())
	println("args[0] value = ", args[0].String(), "type = ", reflect.TypeOf(args[0]).Name(), "type(string) = ", reflect.TypeOf(args[0].String()).Name())
	isFn := args[0].InstanceOf(js.Global().Get("Function"))
	println("isFn ", isFn)
	return nil
}

func main() {
	js.Global().Set("getDominantColor", js.FuncOf(getDominantColor))
	js.Global().Set("getColorPalette", js.FuncOf(getColorPalette))
	js.Global().Set("imageCrop", js.FuncOf(imageCrop))

	// 测试 JS 与 Go 传递数据用
	js.Global().Set("testValue", js.FuncOf(testValue))
	js.Global().Set("testValueOne", js.FuncOf(testValueOne))
	select {}
}
