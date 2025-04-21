package runtime

import (
	"encoding/json"
	"fmt"
	"os"
)

type PackageJSON struct {
	Scripts map[string]string `json:"scripts"`
}

func ExtractNodeStartCommand(pkgPath string) (string, error) {
	data, err := os.ReadFile(pkgPath)
	if err != nil {
		return "", fmt.Errorf("read package.json: %w", err)
	}

	var pkg PackageJSON
	if err := json.Unmarshal(data, &pkg); err != nil {
		return "", fmt.Errorf("parse package.json: %w", err)
	}

	start := pkg.Scripts["start"]
	if start == "" {
		start = "node index.js"
	}
	return start, nil
}

func ExtractPythonStartCommand(projectJsonPath string) (string, error) {
	data, err := os.ReadFile(projectJsonPath)
	if err != nil {
		return "", fmt.Errorf("read project.json: %w", err)
	}

	var project struct {
		Entry string `json:"entry"`
	}

	if err := json.Unmarshal(data, &project); err != nil {
		return "", fmt.Errorf("parse project.json: %w", err)
	}

	if project.Entry == "" {
		return "", fmt.Errorf("missing 'entry' field in project.json")
	}

	return fmt.Sprintf("python %s", project.Entry), nil
}
