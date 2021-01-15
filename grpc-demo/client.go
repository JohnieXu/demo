package main

import (
	"context"
	mygrpc "gorpc_demo/myrpc"

	"google.golang.org/grpc"
)

func main() {
	createClient()
}

func createClient() {
	conn, _ := grpc.Dial("127.0.0.1:9999", grpc.WithInsecure())

	c := mygrpc.NewAddServiceClient(conn)

	req := mygrpc.AddRequest{
		A: 996,
		B: 999,
	}
	reply, _ := c.Add(context.Background(), &req)

	println(reply.Res)
}
