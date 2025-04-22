package runtime

import (
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	pb "seng513-202501-group-27/gen/filetree"
	nginx "seng513-202501-group-27/internal/nginx"
	"time"
)

type Server struct {
	pb.UnimplementedFileServiceServer
}

// hostIP should be your local IP or "127.0.0.1" for default localhost testing
var hostIP = os.Getenv("HOST_IP") // e.g., export HOST_IP=127.0.0.1

func (s *Server) Upload(req *pb.UploadRequest, stream pb.FileService_UploadServer) error {
	if hostIP == "" {
		hostIP = "127.0.0.1"
	}

	projectID := randomSlug(6)
	projectDir := filepath.Join("/tmp/projects", projectID)

	backend := req.ProjectType
	var imageName string
	switch backend {
	case pb.BackendType_NODEJS:
		imageName = "node-app-" + projectID
	case pb.BackendType_FLASK:
		imageName = "flask-app-" + projectID
	default:
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Unsupported backend"})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📁 Writing files..."})
	packagePath, err := WriteDirectory(projectDir, req.GetRoot())
	if err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to write files: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "🔍 Extracting start command..."})

	var startCmd string
	switch backend {
	case pb.BackendType_NODEJS:
		startCmd, err = ExtractNodeStartCommand(packagePath)
		if err != nil {
			_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to extract Node.js start command: " + err.Error()})
			return nil
		}

	case pb.BackendType_FLASK:
		projectJsonPath := filepath.Join(projectDir, "project.json")
		startCmd, err = ExtractPythonStartCommand(projectJsonPath)
		if err != nil {
			_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to extract Flask start command: " + err.Error()})
			return nil
		}

	default:
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Unsupported backend"})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📝 Generating Dockerfile..."})
	if err := GenerateDockerfile(projectDir, startCmd); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to generate Dockerfile: " + err.Error()})
		return nil
	}

	hostPort := assignPortFromSlug(projectID)
	envPath := filepath.Join(projectDir, ".env")

	_ = stream.Send(&pb.UploadResponse{Status: "📦 Reading port from .env..."})
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
	if err := RunDockerContainer(imageName, imageName, hostPort, containerPort); err != nil {
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

	url := fmt.Sprintf("http://%s.%s.nip.io", projectID, hostIP)
	_ = stream.Send(&pb.UploadResponse{Status: "✅ Deployment successful!", Url: url})
	return nil
}

func (s *Server) Redeploy(req *pb.ReuploadRequest, stream pb.FileService_RedeployServer) error {
	if hostIP == "" {
		hostIP = "127.0.0.1"
	}
	projectID := req.GetProjectSlug()
	projectDir := filepath.Join("/tmp/projects", projectID)

	imageName := "node-app-" + projectID
	hostPort := assignPortFromSlug(projectID)

	backend := req.ProjectType

	switch backend {
	case pb.BackendType_NODEJS:
		imageName = "node-app-" + projectID
	case pb.BackendType_FLASK:
		imageName = "flask-app-" + projectID
	default:
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Unsupported backend"})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📁 Updating project files..."})
	packagePath, err := WriteDirectory(projectDir, req.GetRoot())
	if err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to write files: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "🔍 Extracting start command..."})

	var startCmd string
	switch backend {
	case pb.BackendType_NODEJS:
		startCmd, err = ExtractNodeStartCommand(packagePath)
		if err != nil {
			_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to extract Node.js start command: " + err.Error()})
			return nil
		}

	case pb.BackendType_FLASK:
		projectJsonPath := filepath.Join(projectDir, "project.json")
		startCmd, err = ExtractPythonStartCommand(projectJsonPath)
		if err != nil {
			_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to extract Flask start command: " + err.Error()})
			return nil
		}

	default:
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Unsupported backend"})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📝 Generating Dockerfile..."})
	if err := GenerateDockerfile(projectDir, startCmd); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to generate Dockerfile: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "📦 Reading port from .env..."})
	envPath := filepath.Join(projectDir, ".env")
	containerPort, err := DetectPortFromEnv(envPath)
	if err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to detect container port: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: "🔁 Stopping previous container..."})
	_ = StopDockerContainer(imageName)

	_ = stream.Send(&pb.UploadResponse{Status: "🐳 Rebuilding Docker image..."})
	if err := BuildDockerImage(projectDir, imageName); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to build docker image: " + err.Error()})
		return nil
	}

	_ = stream.Send(&pb.UploadResponse{Status: fmt.Sprintf("🚀 Starting container on port %d...", hostPort)})
	if err := RunDockerContainer(imageName, imageName, hostPort, containerPort); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to start container: " + err.Error()})
		return nil
	}
	if err := nginx.ReloadNginx(); err != nil {
		_ = stream.Send(&pb.UploadResponse{Status: "❌ Failed to reload nginx: " + err.Error()})
		return nil
	}
	url := fmt.Sprintf("http://%s.%s.nip.io", projectID, hostIP)

	_ = stream.Send(&pb.UploadResponse{
		Status: "✅ Redeployment successful!",
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
