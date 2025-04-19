package runtime

import (
	"context"
	"fmt"
	"math/rand"
	// "os"
	"path/filepath"
	"time"

	pb "seng513-202501-group-27/gen/filetree"
)

type Server struct {
	pb.UnimplementedFileServiceServer
}

func (s *Server) Upload(ctx context.Context, req *pb.UploadRequest) (*pb.UploadResponse, error) {
	projectID := randomSlug(6)
	projectDir := filepath.Join("/tmp/projects", projectID)

	backend := req.ProjectType

	if backend != pb.BackendType_NODEJS {
		return &pb.UploadResponse{Status: "unsupported backend"}, nil
	}

	packagePath, err := WriteDirectory(projectDir, req.GetRoot())
	if err != nil {
		return nil, err
	}

	startCmd, err := ExtractStartCommand(packagePath)
	if err != nil {
		return nil, err
	}

	if err := GenerateDockerfile(projectDir, startCmd); err != nil {
		return nil, err
	}

	imageName := "node-app-" + projectID
	port := 9000 + rand.Intn(1000)

	if err := BuildDockerImage(projectDir, imageName); err != nil {
		return nil, err
	}
	if err := RunDockerContainer(imageName, port); err != nil {
		return nil, err
	}

	return &pb.UploadResponse{
		Status: "success",
		Url:    fmt.Sprintf("https://%s.webide.site", projectID),
	}, nil
}

func randomSlug(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyz0123456789")
	rand.Seed(time.Now().UnixNano())
	slug := make([]rune, n)
	for i := range slug {
		slug[i] = letters[rand.Intn(len(letters))]
	}
	return string(slug)
}
