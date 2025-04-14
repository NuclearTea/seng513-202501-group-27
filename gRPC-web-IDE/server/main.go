package main

import (
	"context"
	"log"
	"net"

	"Backend/gen/gen/greeter"
	"google.golang.org/grpc"
)

type greeterServer struct {
	greeter.UnimplementedGreeterServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *greeter.HelloRequest) (*greeter.HelloReply, error) {
	return &greeter.HelloReply{Message: "Hello " + req.Name}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listed: %v", err)
	}

	s := grpc.NewServer()
	greeter.RegisterGreeterServer(s, &greeterServer{})

	log.Println("Server running on port 50051")

	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
