package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"log"
	"os"
	"time"
)

func generateRsaKey() {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatal(err)
	}

	block := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: x509.MarshalPKCS1PrivateKey(privateKey),
	}

	block2 := &pem.Block{
		Type:  "RSA PUBLIC KEY",
		Bytes: x509.MarshalPKCS1PublicKey(&privateKey.PublicKey),
	}

	pr := pem.EncodeToMemory(block)
	pb := pem.EncodeToMemory(block2)
	// fmt.Println(b)
	os.WriteFile("demo/rsa/private_key.pem", pr, 0644)
	os.WriteFile("demo/rsa/public_key.pem", pb, 0644)
}

func rsaEncrypt() {
	var appItem1 = &AppItemAll{
		Id:         111,
		MerNo:      "110011001041",
		AppId:      "1110011001041",
		AppName:    "北京工行微信公众号渠道",
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
	}
	log.Printf("%v", appItem1)
	appItemStr, _ := json.Marshal(appItem1)
	// appItemStr, _ := json.Marshal(struct {
	// 	Id uint64
	// }{
	// 	Id: 111,
	// })

	var pk []byte
	var prk []byte
	var err error
	var block *pem.Block
	var block2 *pem.Block
	var encrypted []byte
	if pk, err = os.ReadFile("demo/rsa/public_key.pem"); err != nil {
		log.Fatal(err)
	}
	if prk, err = os.ReadFile("demo/rsa/private_key.pem"); err != nil {
		log.Fatal(err)
	}
	block, _ = pem.Decode(pk)
	block2, _ = pem.Decode(prk)

	pub, _ := x509.ParsePKCS1PublicKey(block.Bytes)
	prv, _ := x509.ParsePKCS1PrivateKey(block2.Bytes)

	log.Printf("start EncryptPKCS1v15 with appItemStr %v", string(appItemStr))

	// 切片加密
	var sliceLen = 0
	var sliceSize = pub.Size() - 100
	for i := 0; i < len(appItemStr); i += sliceSize {
		sliceLen += 1
		end := i + sliceSize
		if end > len(appItemStr) {
			end = len(appItemStr)
		}
		e, err3 := rsa.EncryptPKCS1v15(rand.Reader, pub, appItemStr[i:end])
		if err3 != nil {
			fmt.Println(err3)
		}
		encrypted = append(encrypted, e...)
		fmt.Printf("pub key szie %v\n", sliceSize)
		fmt.Printf("step: %d 原始：%v 密文：%v\n", sliceLen, string(appItemStr[i:end]), base64.StdEncoding.EncodeToString(e))
	}

	fmt.Printf("切片加密结束 切片数量：%d 原始总字节数：%d 密文总字节数：%d\n", sliceLen, len(appItemStr), len(encrypted))

	// res, err = rsa.EncryptPKCS1v15(rand.Reader, pub, appItemStr)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("密文转base64：", base64.StdEncoding.EncodeToString(encrypted))

	log.Printf("start DecryptPKCS1v15")
	// for _, chunk := range encrypted {
	// 	decrypted, err := rsa.DecryptPKCS1v15(rand.Reader, prv, chunk)
	// }
	dec, err := rsa.DecryptPKCS1v15(rand.Reader, prv, encrypted)
	if err != nil {
		fmt.Println("解密失败：", err.Error())
	}
	fmt.Println("解密结果：", string(dec))
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

func main() {
	rsaEncrypt()
}
