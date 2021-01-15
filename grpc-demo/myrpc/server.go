package mygrpc

import (
	"context"
	"fmt"
)

type Service struct {
}

func (s *Service) Add(ctx context.Context, req *AddRequest) (*AddReply, error) {
	fmt.Printf("received A: %d B: %d \n", req.A, req.B)
	res := myAdd(req.A, req.B)
	return &AddReply{Res: res}, nil
}

func myAdd(a int32, b int32) int32 {
	return a + b
}
