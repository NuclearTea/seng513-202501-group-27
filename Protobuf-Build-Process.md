## 🏗️ Build Process Overview (Makefile + Protobuf Generation)

This project uses a `Makefile` to automate the generation of gRPC service code from `.proto` definitions. It supports both:

- **Go backend code generation**
- **TypeScript/JavaScript frontend (gRPC-Web) generation**

This makes sure both frontend and backend agree on how to structure and communicate with each other.

---

### 📄 Makefile Targets

| Target       | Description                                    |
| ------------ | ---------------------------------------------- |
| `make all`   | Runs both `go` and `web` code generation       |
| `make go`    | Generates gRPC code for the Go backend         |
| `make web`   | Generates gRPC-Web code for the React frontend |
| `make clean` | Deletes all generated code to reset the build  |

---

## ⚙️ Details of Each Step

### 🔧 `make go`: Generate Go gRPC Code

This target:

- Uses `protoc` to generate Go bindings for all `.proto` files inside the `proto/` folder.
- Places the output in `gen/`, which is your Go importable module.

```bash
protoc \
  --proto_path=proto \
  --go_out=gen \
  --go-grpc_out=gen \
  proto/*.proto
```

**Output Example:**

```
gen/
├── greeter/
│   ├── greeter.pb.go
│   └── greeter_grpc.pb.go
└── filetree/
    ├── filetree.pb.go
    └── filetree_grpc.pb.go
```

---

### 🌐 `make web`: Generate TypeScript gRPC-Web Code

This target:

- Uses `protoc` to generate JavaScript and TypeScript stubs for gRPC-Web.
- Each `.proto` is compiled separately into its own folder under `UI/src/proto/`.

```bash
protoc \
  --proto_path=proto \
  --js_out=import_style=commonjs:UI/src/proto/<service> \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:UI/src/proto/<service> \
  proto/<service>.proto
```

**Why per-service folders?** This keeps imports clean, modular, and scalable (especially as you add more proto services).

**Example structure:**

```
UI/src/proto/
├── greeter/
│   ├── greeter_pb.js
│   └── greeter_pb_service.ts
├── filetree/
│   ├── filetree_pb.js
│   └── filetree_pb_service.ts
└── dockerLogs/
    ├── dockerLogs_pb.js
    └── dockerLogs_pb_service.ts
```

These files are imported directly into React components via:

```ts
import { GreeterClient } from "../../proto/greeter/greeter_pb_service";
```

---

### 🧹 `make clean`: Clean Generated Code

This removes all auto-generated code to ensure you get a clean build:

```bash
rm -rf gen/
rm -f UI/src/proto/*.{ts,js}
```

> ⚠️ Tip: You may want to improve this to clean up subdirectories like `UI/src/proto/greeter` using `rm -rf`.

---

## 📦 Prerequisites

Ensure the following tools are installed before running `make`:

- `protoc` (Protocol Buffers compiler)
- `protoc-gen-go` and `protoc-gen-go-grpc`
- `protoc-gen-grpc-web`

You can install them via:

```bash
# Go plugins
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# gRPC-Web plugin (usually downloaded separately or via npm)
# For Linux:
# https://github.com/grpc/grpc-web/releases
```

---

## 💡 Why Use a Makefile?

- Ensures **consistent builds** across all contributors.
- Avoids forgetting to regenerate after editing `.proto` files.
- Simplifies build automation with CI/CD (just call `make`).
