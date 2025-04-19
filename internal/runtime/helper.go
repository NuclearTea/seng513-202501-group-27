package runtime

import (
	"bufio"
	"os"
	"strconv"
	"strings"
)

// DetectPortFromEnv reads the .env file and returns the PORT value
func DetectPortFromEnv(envPath string) (int, error) {
	file, err := os.Open(envPath)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "PORT=") {
			portStr := strings.TrimPrefix(line, "PORT=")
			port, err := strconv.Atoi(strings.TrimSpace(portStr))
			if err != nil {
				return 0, err
			}
			return port, nil
		}
	}

	return 0, os.ErrNotExist
}
