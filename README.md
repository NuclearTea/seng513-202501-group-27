# seng513-202501-group-27 🌐 WebIDE Project Overview

This project creates a **browser-based development environment** that lets users upload code (like a Node.js project), run it in the cloud, and access it via a unique subdomain like `https://abc123.webide.site`.

---

## 🧠 What This Project Does

1. A user uploads their Node.js project files from the browser.
2. The backend server:
   - Stores the files
   - Builds a Docker container with the project
   - Runs the container
   - Makes it accessible through a subdomain like `abc123.webide.site`
3. The user can visit that link and see their app running live.

---

## 🖼️ Frontend – React App

The frontend is built using **React**, and it helps the user do the following:

- Select which type of backend they want (currently supports Node.js)
- Edit or review their project files
- Submit their project to the backend for deployment

### 🗃️ How It Manages Data

The app uses a library called **Zustand** to manage file state:

- It keeps track of uploaded files
- Keeps the currently selected file
- Lets the user change the content of a file
- Sends all the project data to the backend using gRPC-Web

---

## 📦 Protocol Buffers (proto)

This is the language used to describe what data is sent between the frontend and backend.

The core messages include:

- `File`: represents an individual file
- `Directory`: represents folders with children (files or more folders)
- `UploadRequest`: the full request to send the project and backend type
- `UploadResponse`: gives back the deployment status and URL

Protobuf helps generate consistent code for both Go (backend) and TypeScript (frontend).

---

## 🧩 Backend – Go gRPC Server

The Go backend does all the heavy lifting. When it receives a project, it:

1. Writes the project files to disk
2. Reads the `.env` file to figure out what port the project uses
3. Creates a Dockerfile and builds a Docker image
4. Runs that image in a Docker container
5. Assigns a random subdomain
6. Updates NGINX to route traffic from the subdomain to that container

---

## 🚪 Accessing Your Project – NGINX

**NGINX** is a web server. Here’s how we use it:

- When a project is deployed, we write an NGINX config file for it
- The config says: “If someone visits abc123.webide.site, forward them to this specific container running on a certain port”
- Then we reload NGINX to apply the change

This is what allows each app to be reachable on its own unique link.

---

## 🧭 Routing gRPC from the Browser – Envoy

**gRPC** normally doesn't work in the browser, so we use **Envoy** as a proxy.

Envoy receives gRPC-Web requests from the browser and converts them into normal gRPC requests that the Go server can understand.

---

## 🐳 Docker and Deployment

Every app runs in a separate Docker container. The backend:

- Builds the container based on the uploaded files
- Assigns a random port to avoid conflicts
- Starts the container
- Makes sure the NGINX proxy routes traffic to the correct place

The backend uses the Docker CLI from inside the container to manage all this.

---

## 🔌 Local Development

To run this project locally:

1. Start all services with Docker Compose:

```bash
docker-compose up --build
```

2. Add a test slug to your `/etc/hosts` file:

```bash
127.0.0.1 abc123.webide.site
```

3. Send a project from the UI
4. Visit http://abc123.webide.site
