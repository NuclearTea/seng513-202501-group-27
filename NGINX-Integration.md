## 🌐 NGINX in the Web IDE Project

In this project, **NGINX** acts as a **reverse proxy** that routes traffic from custom subdomains (like `project-name.127.0.0.1.nip.io`) to the correct running Docker container. This allows each deployed project to be accessed through its own unique web address.

### 📌 Why NGINX?

- To **expose each project container to the internet (or local browser)** using a unique subdomain.
- To avoid port conflicts by routing based on domain name rather than port numbers.
- To support **friendly URLs** like `myproject.127.0.0.1.nip.io` during local development without editing `/etc/hosts`, using [nip.io](https://nip.io) for wildcard DNS.

---

## 🏗️ Role of NGINX in the System

Here’s how NGINX fits into the system:

```text
                            +----------------------+
                            |    Your Web Browser  |
                            |  http://slug.127.0.0.1.nip.io  |
                            +-----------+----------+
                                        |
                                        v
                           +-----------------------+
                           |        NGINX          |
                           |  (Listens on port 80) |
                           +----------+------------+
                                      |
                                      v
                         +----------------------------+
                         |  Docker Container for Slug |
                         |  (Running Node.js/Flask)   |
                         +----------------------------+
```

---

## ⚙️ How It Works

Each time a new project is deployed, your backend:

1. Picks an available port for the container.
2. Starts a Docker container (e.g., with Flask or Node.js app).
3. Writes an **NGINX config file** using a slug (e.g., `myapp`) and the chosen port.
4. Reloads NGINX to apply the new configuration.

For example, this domain:

```
http://myapp.127.0.0.1.nip.io
```

will map to:

```
http://host.docker.internal:PORT
```

---

## 🧾 Sample NGINX Config (per slug)

```nginx
server {
    listen 80;
    server_name myapp.127.0.0.1.nip.io;

    location / {
        proxy_pass http://host.docker.internal:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

> 💡 These config files are saved in `/etc/nginx/sites-available/` and symlinked into `/etc/nginx/sites-enabled/`.

---

## ⚙️ Project Code That Writes NGINX

Your Go backend uses code like:

```go
func WriteNginxConfig(slug string, port int) error {
    domain := fmt.Sprintf("%s.127.0.0.1.nip.io", slug)
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
}`
    content := fmt.Sprintf(nginxTemplate, domain, port)
    confPath := "/etc/nginx/sites-available/" + slug
    os.WriteFile(confPath, []byte(content), 0644)
    os.Symlink(confPath, "/etc/nginx/sites-enabled/"+slug)
    exec.Command("nginx", "-s", "reload").Run()
}
```

---

## 🧪 Local Development Notes

- Your browser sends requests like `http://test.127.0.0.1.nip.io`.
- `nip.io` resolves this to `127.0.0.1` (your localhost).
- NGINX reads the subdomain (`test`) and proxies the request to the correct container port.

---

## 📦 Dockerized NGINX

In `docker-compose.yml`:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./docker/nginx:/etc/nginx/
    - /etc/nginx/sites-available:/etc/nginx/sites-available
    - /etc/nginx/sites-enabled:/etc/nginx/sites-enabled
  depends_on:
    - server
```

> ⚠️ To make this work:
>
> - The backend container must be able to write to the host-mounted NGINX config directory.
> - NGINX must be granted permission to reload (`nginx -s reload` may require root access or a special entrypoint).

---

## 🧠 Dynamic NGINX Config Manager

To support on-demand project creation and deployment, the Web IDE includes a **Dynamic NGINX Config Manager** implemented in the backend server. This component is responsible for creating and activating custom NGINX configurations when a new project is deployed, and optionally removing them when a project is deleted.

### ⚙️ Responsibilities

1. **Generate a unique domain name** based on the project slug.
2. **Assign a port** for the container that will host the project.
3. **Write an NGINX config file** that maps the domain to the container's internal port.
4. **Enable the site** by symlinking it to the NGINX active config directory.
5. **Reload NGINX** to apply the updated routing without restarting the server.

---

### 🔄 Lifecycle

Here’s what happens when a new project is deployed:

1. The backend receives a deployment request with a project name (slug).
2. It selects a free port and launches a container.
3. It calls `WriteNginxConfig(slug, port)` to:
   - Generate a config file in `/etc/nginx/sites-available/{slug}`
   - Create a symlink in `/etc/nginx/sites-enabled/{slug}`
   - Reload NGINX (`nginx -s reload`) to apply changes
4. The domain `slug.127.0.0.1.nip.io` becomes immediately accessible.

On deletion or redeployment:

- The same system can **remove** the old config and symlink.
- Optionally clean up unused ports and containers.

---

### 📁 Example Files Created

```text
/etc/nginx/sites-available/myproject
/etc/nginx/sites-enabled/myproject  → symlink to the above
```

### ✏️ Example Go Function (Simplified)

```go
func WriteNginxConfig(slug string, port int) error {
	domain := fmt.Sprintf("%s.127.0.0.1.nip.io", slug)
	conf := fmt.Sprintf(`
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
`, domain, port)

	confPath := "/etc/nginx/sites-available/" + slug
	linkPath := "/etc/nginx/sites-enabled/" + slug

	_ = os.WriteFile(confPath, []byte(conf), 0644)
	_ = os.Symlink(confPath, linkPath)
	_ = exec.Command("nginx", "-s", "reload").Run()

	return nil
}
```

---

### ✅ Benefits

- **Fully automated routing** – no need to manually configure anything.
- **Domain-based separation** – every project lives on its own subdomain.
- **Hot reload** – adding/removing configs doesn’t require restarting NGINX.

---

### ⚠️ Permissions & Security Notes

- The backend container or process **must have permission** to write to the NGINX config directories.
- You may need to run the backend with elevated privileges or mount the directories into the backend container.
- Always validate the `slug` to prevent path traversal or injection attacks when writing config files.

---

### 🔄 Optional Enhancements

- Add cleanup logic to delete unused configs and containers.
- Add logging or metrics for domain creation and reload events.
- Switch to a templating engine like `text/template` for safer config generation.

---

## ✅ Benefits of This Approach

- **Clean subdomain URLs**: Looks like production, works in development.
- **Avoids port juggling**: Each container can use a random port.
- **Scalable**: Can route hundreds of containers with unique slugs.
- **Flexible**: Easily extended to HTTPS and domain name verification.

---

## 🧰 Troubleshooting Tips

- If a container doesn't load:
  - Check `nginx -t` for config errors.
  - Look at `docker logs nginx` for runtime issues.
- If reloading NGINX fails:
  - Ensure the user has permission (try running the backend with elevated privileges).
- Verify the `proxy_pass` target is reachable from within the NGINX container (`host.docker.internal` works in Docker Desktop).

```

```

```

```
