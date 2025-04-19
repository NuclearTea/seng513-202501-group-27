package nginx

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// writeNginxConfig creates an nginx config file to route slug.webide.site → localhost:port
func WriteNginxConfig(slug string, port int) error {
	const nginxTemplate = `
server {
    listen 80;
    server_name %s.webide.site;

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

	configContent := fmt.Sprintf(nginxTemplate, slug, port)

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
