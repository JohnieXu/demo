package main

import (
	"bytes"
	"errors"
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

type CropSize struct {
	StartX int
	StartY int
	Width  int
	Height int
}

func ImageCrop(img image.Image, size CropSize) (image.Image, error) {
	width := img.Bounds().Dx()
	height := img.Bounds().Dy()

	if width < size.Width || height < size.Height {
		return nil, errors.New("size too big")
	}

	// TODO: 校验尺寸
	// TODO: 捕捉类型转换报错
	image := img.(*image.YCbCr).SubImage(image.Rect(size.StartX, size.StartY, size.Width, size.Height))
	return image, nil
}
