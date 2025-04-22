package logs

import (
	"bufio"
	"fmt"
	"os/exec"
	pb "seng513-202501-group-27/gen/dockerLogs"
	"time"
)

type Server struct {
	pb.UnimplementedDockerLogServiceServer
}

func (s *Server) StreamDockerLogs(req *pb.DockerLogRequest, stream pb.DockerLogService_StreamDockerLogsServer) error {
	cmd := exec.Command("docker", "logs", "-f", req.GetContainerId())

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return fmt.Errorf("stdout pipe error: %w", err)
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return fmt.Errorf("stderr pipe error: %w", err)
	}

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("docker logs start error: %w", err)
	}
	defer cmd.Wait()

	// Forward log lines with [stdout] or [stderr] tag
	forward := func(reader *bufio.Reader, tag string) {
		for {
			line, err := reader.ReadString('\n')
			if err != nil {
				break
			}
			entry := &pb.DockerLogEntry{
				Message:   fmt.Sprintf("[%s] %s", tag, line),
				Timestamp: time.Now().Format(time.RFC3339),
			}
			_ = stream.Send(entry)
		}
	}

	go forward(bufio.NewReader(stdout), "stdout")
	go forward(bufio.NewReader(stderr), "stderr")

	// Block until the logs command exits
	return cmd.Wait()
}
