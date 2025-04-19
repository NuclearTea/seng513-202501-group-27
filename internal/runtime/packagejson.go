package runtime

import (
	"encoding/json"
	"fmt"
	"os"
)

type PackageJSON struct {
	Scripts map[string]string `json:"scripts"`
}

func ExtractStartCommand(pkgPath string) (string, error) {
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
