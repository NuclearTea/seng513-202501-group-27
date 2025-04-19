# 🛠️ WebIDE Dynamic App Deployment Checklist

This guide summarizes the steps needed to deploy and serve uploaded apps on dynamic subdomains using Docker, NGINX, and your gRPC backend.

---

## 🧰 Initial Setup (One-Time)

### 🐳 Docker Compose

Make sure you have a `docker-compose.yml` that runs:

- `grpc-server` (your Go backend)
- `nginx` (for routing subdomains)
- Optionally `envoy` (if you're using gRPC-Web)

```bash
docker-compose up --build
```

---

## ⚙️ Project Flow Checklist (Every Time a New App is Uploaded)

### ✅ 1. **Generate a unique slug**
- Random 6-char string like `vagnls`

---

### ✅ 2. **Write project files to disk**

```
/project_root/
└── slug/               # e.g. /tmp/projects/vagnls
    ├── index.js
    ├── package.json
    ├── .env            # must include PORT=xxxx
```

Use `WriteDirectory()` and log every file written.

---

### ✅ 3. **Extract port from `.env`**
```env
PORT=3000
```
→ `containerPort := 3000`

---

### ✅ 4. **Assign a unique host port**
```go
hostPort := 9000 + hash(slug) % 1000
```

---

### ✅ 5. **Generate Dockerfile**
Use `containerPort` in the `CMD` like:

```Dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
CMD ["sh", "-c", "npm start"]
```

---

### ✅ 6. **Build Docker image**
```bash
docker build -t node-app-<slug> /tmp/projects/<slug>
```

---

### ✅ 7. **Run container and map port**
```bash
docker run -d -p <hostPort>:<containerPort> --name node-app-<slug> node-app-<slug>
```

---

### ✅ 8. **Write NGINX config**
In Go, write to `/etc/nginx/sites-available/<slug>`:

```nginx
server {
  listen 80;
  server_name <slug>.webide.site;

  location / {
    proxy_pass http://host.docker.internal:<hostPort>;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Then symlink to `sites-enabled`.

---

### ✅ 9. **Reload NGINX**
```bash
docker exec nginx nginx -s reload
```

---

### ✅ 10. **Add to /etc/hosts (Dev only)**
```bash
sudo nano /etc/hosts
```
Add:
```
127.0.0.1 <slug>.webide.site
```

---

### ✅ 11. **Test It**
```bash
curl http://<slug>.webide.site
```
Or visit in browser.

---

## 🧽 Cleanup (Optional)

To remove an old project:

```bash
docker stop node-app-<slug> && docker rm node-app-<slug>
rm -rf /tmp/projects/<slug>
rm /etc/nginx/sites-available/<slug>
rm /etc/nginx/sites-enabled/<slug>
docker exec nginx nginx -s reload
```

---

Happy deploying! 🚀
