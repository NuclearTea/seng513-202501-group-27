package runtime

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/docker/docker/errdefs"
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
	ctx := context.Background()
	networkName := os.Getenv("DOCKER_NETWORK")
	if networkName == "" {
		networkName = "webide-net"
	}

	if err := ensureDockerNetworkExists(networkName); err != nil {
		return fmt.Errorf("failed to ensure docker network exists: %v", err)
	}

	log.Printf("🚀 Launching container %s (image: %s) on port %d...\n", containerName, imageName, hostPort)

	cmd := exec.Command("docker", "run", "-d",
		"--name", containerName,
		"--network", networkName,
		"-p", fmt.Sprintf("%d:%d", hostPort, containerPort),
		imageName)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to start container: %v\n%s", err, output)
	}

	containerID := strings.TrimSpace(string(output))
	if containerID == "" {
		return fmt.Errorf("no container ID returned from docker run")
	}

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return fmt.Errorf("failed to create Docker client: %v", err)
	}

	time.Sleep(1 * time.Second)

	inspect, err := cli.ContainerInspect(ctx, containerID)
	if err != nil {
		return fmt.Errorf("failed to inspect container: %v", err)
	}

	if inspect.State != nil && !inspect.State.Running {
		logReader, err := cli.ContainerLogs(ctx, containerID, types.ContainerLogsOptions{
			ShowStdout: true,
			ShowStderr: true,
			Tail:       "20",
		})
		var logs string
		if err == nil {
			var buf bytes.Buffer
			_, _ = buf.ReadFrom(logReader)
			logs = buf.String()
		} else {
			logs = fmt.Sprintf("Could not retrieve logs: %v", err)
		}

		// Clean up failed container only
		_ = StopDockerContainer(containerName)

		return fmt.Errorf(
			"container %s exited early with code %d\nReason: %s\nRecent logs:\n%s",
			containerName,
			inspect.State.ExitCode,
			inspect.State.Error,
			logs,
		)
	}

	return nil
}

func StopDockerContainer(containerName string) error {
	cmd := exec.Command("docker", "rm", "-f", containerName)
	return cmd.Run()
}

func ensureDockerNetworkExists(networkName string) error {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return err
	}

	_, err = cli.NetworkInspect(context.Background(), networkName, types.NetworkInspectOptions{})
	if err == nil {
		return nil // already exists
	}
	if !errdefs.IsNotFound(err) {
		return err // error not related to missing network
	}

	_, err = cli.NetworkCreate(context.Background(), networkName, types.NetworkCreate{
		CheckDuplicate: true,
	})
	return err
}
