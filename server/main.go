package main

import (
	"log"
	"net"

	filetreepb "seng513-202501-group-27/gen/filetree"
	// greeterpb "seng513-202501-group-27/gen/greeter"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	dockerLogspb "seng513-202501-group-27/gen/dockerLogs"
	"seng513-202501-group-27/internal/logs"
	"seng513-202501-group-27/internal/runtime"
)

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	filetreepb.RegisterFileServiceServer(s, &runtime.Server{})
	dockerLogspb.RegisterDockerLogServiceServer(s, &logs.Server{})
	reflection.Register(s)

	log.Println("Server running on :8080")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
