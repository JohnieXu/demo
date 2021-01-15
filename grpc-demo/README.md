# grpc demo

## 准备工作

1 安装protoc
```
https://github.com/protocolbuffers/protobuf/releases/tag/v3.14.0
```
2 安装protoc-gen-go
```bash
go get -u github.com/golang/protobuf/protoc-gen-go
```

3 安装grpc
```bash
go get google.golang.org/grpc
```

## 编译 proto 文件

```bash
protoc --go_out=plugins=grpc:. add.proto
```

## 启动项目

启动服务端
```bash
go run main.go
```

启动客户端
```bash
go run client.go
```
