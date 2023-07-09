package main

import (
	"image"
	"os"
	"syscall/js"

	"github.com/johniexu/dominantcolor2"
)

func dominantcolor(data js.Value) {

}

func main2() {
	f, _ := os.Open("/Users/johniexu/Documents/github/dominantcolor2/21156871.jpeg")
	img, _, _ := image.Decode(f)
	println(dominantcolor2.Hex(dominantcolor2.Find(img)))

	// js.Global().Set('dominantcolor', js.NewCallback(*dominantcolor))
}
