package main

import (
	"fmt"
	mygrpc "gorpc_demo/myrpc"
	"net"

	"google.golang.org/grpc"
)

func main() {
	createServer()
}

func createServer() {
	s, _ := net.Listen("tcp", ":9999")
	myService := mygrpc.Service{}

	grpcServer := grpc.NewServer()

	mygrpc.RegisterAddServiceServer(grpcServer, &myService)

	fmt.Println("listening at port 9999")

	grpcServer.Serve(s)

}
