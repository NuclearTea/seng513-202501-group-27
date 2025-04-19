package main

import (
	"log"
	"net"

	filetreepb "seng513-202501-group-27/gen/filetree"
	// greeterpb "seng513-202501-group-27/gen/greeter"
	"seng513-202501-group-27/internal/runtime"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	filetreepb.RegisterFileServiceServer(s, &runtime.Server{})
	reflection.Register(s)

	log.Println("Server running on :8080")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
