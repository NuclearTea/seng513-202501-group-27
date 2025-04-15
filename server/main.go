package main

import (
	"context"
	"log"
	"net"

	"google.golang.org/grpc"
	"seng513-202501-group-27/gen/go/greeter"
)

type server struct {
	greeter.UnimplementedGreeterServer
}

func (s *server) SayHello(ctx context.Context, req *greeter.HelloRequest) (*greeter.HelloReply, error) {
	msg := "Hello, " + req.GetName()
	return &greeter.HelloReply{Message: msg}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	greeter.RegisterGreeterServer(grpcServer, &server{})

	log.Println("gRPC server listening on :8080")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
