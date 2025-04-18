package main

import (
	"context"
	"log"
	"net"

	filetreepb "seng513-202501-group-27/gen/filetree"
	greeterpb "seng513-202501-group-27/gen/greeter"

	"google.golang.org/grpc"
)

// Greeter service
type greeterServer struct {
	greeterpb.UnimplementedGreeterServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *greeterpb.HelloRequest) (*greeterpb.HelloReply, error) {
	log.Println("Received:", req.GetName())
	return &greeterpb.HelloReply{Message: "Hello " + req.GetName()}, nil
}

// File upload service
type fileServer struct {
	filetreepb.UnimplementedFileServiceServer
}

func (s *fileServer) Upload(ctx context.Context, req *filetreepb.UploadRequest) (*filetreepb.UploadResponse, error) {
	root := req.GetRoot()
	log.Println("Uploaded root dir:", root.GetName())
	return &filetreepb.UploadResponse{Status: "Success Uploading: " + root.GetName()}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	greeterpb.RegisterGreeterServer(grpcServer, &greeterServer{})
	filetreepb.RegisterFileServiceServer(grpcServer, &fileServer{})

	log.Println("gRPC server listening on :8080")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
