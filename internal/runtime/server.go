package runtime

import (
	"context"
	"fmt"
	"math/rand"
	"path/filepath"
	pb "seng513-202501-group-27/gen/filetree"
	nginx "seng513-202501-group-27/internal/nginx"
	"time"
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
		return nil, fmt.Errorf("failed to write files: %w", err)
	}

	startCmd, err := ExtractStartCommand(packagePath)
	if err != nil {
		return nil, fmt.Errorf("failed to extract start command: %w", err)
	}

	if err := GenerateDockerfile(projectDir, startCmd); err != nil {
		return nil, fmt.Errorf("failed to generate Dockerfile: %w", err)
	}

	imageName := "node-app-" + projectID
	hostPort := assignPortFromSlug(projectID)

	// ✅ Read internal container port from .env
	envPath := filepath.Join(projectDir, ".env")
	containerPort, err := DetectPortFromEnv(envPath)
	if err != nil {
		return nil, fmt.Errorf("failed to detect container port from .env: %w", err)
	}

	if err := BuildDockerImage(projectDir, imageName); err != nil {
		return nil, fmt.Errorf("failed to build docker image: %w", err)
	}

	if err := RunDockerContainer(imageName, hostPort, containerPort); err != nil {
		return nil, fmt.Errorf("failed to run docker container: %w", err)
	}

	if err := nginx.WriteNginxConfig(projectID, hostPort); err != nil {
		return nil, fmt.Errorf("failed to write nginx config: %w", err)
	}

	if err := nginx.ReloadNginx(); err != nil {
		return nil, fmt.Errorf("failed to reload nginx: %w", err)
	}

	fmt.Printf("[launch] %s → host:%d → container:%d\n", projectID, hostPort, containerPort)
	return &pb.UploadResponse{
		Status: "success",
		Url:    fmt.Sprintf("http://%s.webide.site", projectID),
	}, nil
}

// randomSlug generates a random 6-character slug.
func randomSlug(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyz0123456789")
	rand.Seed(time.Now().UnixNano())
	slug := make([]rune, n)
	for i := range slug {
		slug[i] = letters[rand.Intn(len(letters))]
	}
	return string(slug)
}

// assignPortFromSlug maps a slug deterministically to a port (9000–9999)
func assignPortFromSlug(slug string) int {
	hash := 0
	for i := range len(slug) {
		hash += int(slug[i])
	}
	return 9000 + (hash % 1000)
}
