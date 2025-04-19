package runtime

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func GenerateDockerfile(projectDir, startCmd string) error {
	content := fmt.Sprintf(`
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
CMD ["sh", "-c", "%s"]
`, startCmd)
	return os.WriteFile(filepath.Join(projectDir, "Dockerfile"), []byte(content), 0644)
}

func BuildDockerImage(projectDir, imageName string) error {
	cmd := exec.Command("docker", "build", "-t", imageName, ".")
	cmd.Dir = projectDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func RunDockerContainer(imageName string, hostPort int, containerPort int) error {
	cmd := exec.Command("docker", "run", "-d",
		"-p", fmt.Sprintf("%d:%d", hostPort, containerPort),
		"--rm", imageName)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
