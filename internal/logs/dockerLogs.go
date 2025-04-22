package logs

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"os/exec"
	"strings"
	"time"

	pb "seng513-202501-group-27/gen/dockerLogs"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
)

type Server struct {
	pb.UnimplementedDockerLogServiceServer
}

// StreamDockerLogs streams stdout, stderr, and Docker events with prefixes
func (s *Server) StreamDockerLogs(req *pb.DockerLogRequest, stream pb.DockerLogService_StreamDockerLogsServer) error {
	containerID := req.GetContainerId()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	messages := make(chan string)

	// Stream stdout and stderr separately
	go func() {
		cmd := exec.Command("docker", "logs", "-f", containerID)

		stdoutPipe, err := cmd.StdoutPipe()
		if err != nil {
			messages <- "[ERROR] Failed to attach to stdout: " + err.Error()
			return
		}
		stderrPipe, err := cmd.StderrPipe()
		if err != nil {
			messages <- "[ERROR] Failed to attach to stderr: " + err.Error()
			return
		}

		if err := cmd.Start(); err != nil {
			messages <- "[ERROR] Failed to start log command: " + err.Error()
			return
		}

		// Separate goroutines for stdout and stderr
		go streamOutput(stdoutPipe, "[STDOUT]", messages)
		go streamOutput(stderrPipe, "[STDERR]", messages)

		_ = cmd.Wait()
	}()

	// Stream Docker container events
	go func() {
		cli, err := client.NewClientWithOpts(client.FromEnv)
		if err != nil {
			messages <- "[ERROR] Failed to create Docker client: " + err.Error()
			return
		}

		eventFilter := filters.NewArgs()
		eventFilter.Add("container", containerID)

		options := types.EventsOptions{Filters: eventFilter}
		eventChan, errChan := cli.Events(ctx, options)

		for {
			select {
			case event := <-eventChan:
				eventMsg := fmt.Sprintf("[EVENT] %s (%s)", event.Action, event.Type)
				messages <- eventMsg
			case err := <-errChan:
				if err != nil && err != context.Canceled {
					messages <- "[ERROR] Event stream error: " + err.Error()
				}
				return
			case <-ctx.Done():
				return
			}
		}
	}()

	// Send messages to gRPC client
	for msg := range messages {
		entry := &pb.DockerLogEntry{
			Message:   msg,
			Timestamp: time.Now().Format(time.RFC3339),
		}
		if err := stream.Send(entry); err != nil {
			break
		}
	}

	return nil
}

// Helper to stream lines from an io.Reader with a prefix
func streamOutput(r io.Reader, prefix string, out chan<- string) {
	reader := bufio.NewReader(r)
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			break
		}
		line = strings.TrimRight(line, "\r\n")
		out <- fmt.Sprintf("%s %s", prefix, line)
	}
}
