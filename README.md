# SENG513 Winter 2025 Final Project - 🌐 Web IDE

Welcome to the **Web IDE Project** — a browser-based development environment that lets you create, edit, run, and manage code projects without installing anything on your computer. It's like having Visual Studio Code, a terminal, and a deployment server all inside your browser.

## 📦 What This Project Includes

This project has several parts working together to deliver a full-featured web development experience:

### 🖥️ Frontend (UI/)

- **What it is**: The user interface you see in your browser.
- **What it does**: Lets you create projects, write code, switch between files, and view output logs.
- **Built with**: React (JavaScript framework).

### 🧠 Backend Server (server/)

- **What it is**: The brain of the system.
- **What it does**: Handles project creation, file uploads, and talks to Docker to run your code.
- **Built with**: Go using gRPC (a fast communication method between programs).

### 📜 Protobuf Definitions (proto/)

- **What it is**: A shared language between the frontend and backend.
- **What it does**: Defines how different parts of the app talk to each other.

### ⚙️ Generated Code (gen/go/ & UI/proto)

- **What it is**: Auto-generated files from the protobuf definitions.
- **What it does**: Enables Go and the browser to understand and use the protobuf services.

### 🐳 Docker Support (Dockerfiles, Docker-Compose)

- **What it is**: Configuration files for running everything in containers.
- **What it does**: Packages the app so you can run it easily without installing each part manually.

### 🌐 NGINX Gateway (optional)

- **What it is**: A traffic router that lets each user's project be available on its own unique web address (like `myproject.127.0.0.1.nip.io`).
- **What it does**: Helps route incoming requests to the right container.

## 🚀 How to Run It with Docker

Make sure you have **Docker** and **Docker Compose** installed on your computer.

### 1. Clone the Repository

```bash
git clone https://github.com/NuclearTea/seng513-202501-group-27
cd seng513-202501-group-27
```

### 2. Build and Start All Services

```bash
docker compose up --build
```

This will:

- Start the frontend (the UI)
- Start the backend server
- Start a reverse proxy if configured
- Set up networking between everything

### 3. Open in Your Browser

Once it’s running, go to:

```
http://localhost:3000
```

You should see the Web IDE interface ready to use.

## 💡 Features

- Create projects using Node.js or Flask (more to come!)
- View, edit, and save files
- Download your project from the web
- Run and redeploy projects in Docker containers
- View real-time logs in the browser
- Automatically assigns a URL for each running project (e.g., `project.127.0.0.1.nip.io`)

## 🛠️ Tech Stack Summary

| Layer        | Tool/Framework           | Description                        |
| ------------ | ------------------------ | ---------------------------------- |
| Frontend     | React + Zustand          | For UI and state management        |
| Backend      | Go + gRPC                | For logic and communication        |
| API Contract | Protocol Buffers (proto) | Defines how systems talk           |
| Containers   | Docker + Docker Compose  | Runs the whole system              |
| Proxy        | NGINX + nip.io           | Routes traffic to correct projects |

## 🧰 Developer Notes

- You can add support for other languages by defining new project templates and updating the backend.
- The system uses `nip.io` for easy subdomain routing during local development — no `hosts` file editing required.

```

```
