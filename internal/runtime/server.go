package runtime

import (
	"fmt"
	"math/rand"
	"path/filepath"
	"time"

	pb "seng513-202501-group-27/gen/filetree"
	nginx "seng513-202501-group-27/internal/nginx"
)

type Server struct {
	pb.UnimplementedFileServiceServer
}

func (s *Server) Upload(req *pb.UploadRequest, stream pb.FileService_UploadServer) error {
	projectID := randomSlug(6)
	projectDir := filepath.Join("/tmp/projects", projectID)

	backend := req.ProjectType
	if backend != pb.BackendType_NODEJS {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Unsupported backend"})
		return nil
	}
	time.Sleep(5000 * time.Millisecond)
	_ = stream.Send(&pb.UploadResponse{Status: "📁 Writing files..."})
	packagePath, err := WriteDirectory(projectDir, req.GetRoot())
	if err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to write files: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "🔍 Extracting start command..."})
	startCmd, err := ExtractStartCommand(packagePath)
	if err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to extract start command: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📝 Generating Dockerfile..."})
	if err := GenerateDockerfile(projectDir, startCmd); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to generate Dockerfile: " + err.Error()})
		return nil
	}

	imageName := "node-app-" + projectID
	hostPort := assignPortFromSlug(projectID)

	_ = stream.Send(&pb.UploadResponse{Status: "📦 Reading port from .env..."})
	envPath := filepath.Join(projectDir, ".env")
	containerPort, err := DetectPortFromEnv(envPath)
	if err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to detect container port: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "🐳 Building Docker image..."})
	if err := BuildDockerImage(projectDir, imageName); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to build docker image: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: fmt.Sprintf("🚀 Running container on port %d...", hostPort)})
	if err := RunDockerContainer(imageName, hostPort, containerPort); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to run container: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📡 Writing NGINX config..."})
	if err := nginx.WriteNginxConfig(projectID, hostPort); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to write nginx config: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "🔁 Reloading NGINX..."})
	if err := nginx.ReloadNginx(); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to reload nginx: " + err.Error()})
		return nil
	}

	url := fmt.Sprintf("http://%s.webide.site", projectID)
	_ = stream.Send(&pb.UploadResponse{
		Status: "✅ Deployment successful!",
		Url:    url,
	})
	return nil
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
