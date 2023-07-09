package main

import (
	"image"
	_ "image/jpeg"
	"os"

	"github.com/johniexu/dominantcolor2"
)

func main() {
	f, _ := os.Open("/Users/johniexu/Documents/github/dominantcolor2/21156871.jpeg")
	img, _, _ := image.Decode(f)
	println(dominantcolor2.Hex(dominantcolor2.Find(img)))
}
