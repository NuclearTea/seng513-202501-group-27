package nginx

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

// hostIP should be your local IP or "127.0.0.1" for default localhost testing
var hostIP = os.Getenv("HOST_IP") // e.g., export HOST_IP=127.0.0.1

func WriteNginxConfig(slug string, port int) error {
	if hostIP == "" {
		hostIP = "127.0.0.1"
	}

	log.Printf("[nginx] Using HOST_IP: %s\n", hostIP)
	// slug.127.0.0.1.nip.io → maps to 127.0.0.1
	domain := fmt.Sprintf("%s.%s.nip.io", slug, hostIP)

	const nginxTemplate = `
server {
    listen 80;
    server_name %s;

    location / {
        proxy_pass http://host.docker.internal:%d;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
`

	configContent := fmt.Sprintf(nginxTemplate, domain, port)

	// Write config file to sites-available
	confPath := filepath.Join("/etc/nginx/sites-available", slug)
	if err := os.WriteFile(confPath, []byte(configContent), 0644); err != nil {
		return fmt.Errorf("writing nginx site file failed: %w", err)
	}

	// Symlink into sites-enabled
	linkPath := filepath.Join("/etc/nginx/sites-enabled", slug)
	if err := os.Symlink(confPath, linkPath); err != nil && !os.IsExist(err) {
		return fmt.Errorf("symlinking nginx site failed: %w", err)
	}

	return nil
}

// reloadNginx forces nginx to reload its configs

func ReloadNginx() error {
	cmd := exec.Command("docker", "exec", "nginx", "nginx", "-s", "reload")
	return cmd.Run()
}
