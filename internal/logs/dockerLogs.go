package logs

import (
	"bufio"

	"os/exec"
	pb "seng513-202501-group-27/gen/dockerLogs"
	"time"
)

type Server struct {
	pb.UnimplementedDockerLogServiceServer
}

func (s *Server) StreamDockerLogs(req *pb.DockerLogRequest, stream pb.DockerLogService_StreamDockerLogsServer) error {
	cmd := exec.Command("docker", "logs", "-f", "node-app-"+req.GetContainerId())
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	if err := cmd.Start(); err != nil {
		return err
	}
	defer cmd.Wait()

	reader := bufio.NewReader(stdout)
	for {
		line, err := reader.ReadString('\n') // reads until newline
		if err != nil {
			break
		}

		entry := &pb.DockerLogEntry{
			Message:   line,
			Timestamp: time.Now().Format(time.RFC3339),
		}
		if err := stream.Send(entry); err != nil {
			break
		}
	}
	return nil
}
