package runtime

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func GenerateDockerfile(projectDir, startCmd string) error {
	var baseImage, installCmd string

	switch {
	case strings.HasPrefix(startCmd, "node"):
		baseImage = "node:22"
		installCmd = "npm install"
	case strings.HasPrefix(startCmd, "python"):
		baseImage = "python:3.11-slim"
		installCmd = "pip install -r requirements.txt"
	default:
		baseImage = "alpine"
		installCmd = "# No install step"
	}

	content := fmt.Sprintf(`
FROM %s
WORKDIR /app
COPY . .
RUN %s
CMD ["sh", "-c", "%s"]
`, baseImage, installCmd, startCmd)

	return os.WriteFile(filepath.Join(projectDir, "Dockerfile"), []byte(content), 0644)
}

func BuildDockerImage(projectDir, imageName string) error {
	cmd := exec.Command("docker", "build", "-t", imageName, ".")
	cmd.Dir = projectDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func RunDockerContainer(containerName, imageName string, hostPort, containerPort int) error {
	cmd := exec.Command("docker", "run", "-d",
		"--name", containerName,
		"-p", fmt.Sprintf("%d:%d", hostPort, containerPort),
		"--rm", imageName)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func StopDockerContainer(imageName string) error {
	cmd := exec.Command("docker", "rm", "-f", imageName)
	return cmd.Run()
}
