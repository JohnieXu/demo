package main

import (
	"bytes"
	"image"
	"image/jpeg"
)

// 将[]byte转换为图像
func ConvertBytesToImage(data []byte) (image.Image, error) {
	img, err := jpeg.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, err
	}
	return img, nil
}
