## 🌐 Envoy Proxy in the Web IDE Project

In this project, **Envoy** acts as a **gateway between the frontend (React) and the backend (Go gRPC server)** by enabling support for **gRPC-Web**, a transport protocol designed to bring gRPC to modern web browsers.

### 📌 Why Envoy?

Browsers cannot directly use native gRPC because:

- gRPC relies on HTTP/2 features like bidirectional streaming and multiplexed requests.
- Most browsers do not expose these features directly to JavaScript.

To solve this, **Envoy converts gRPC-Web requests from the browser into standard gRPC requests** that the Go backend can handle.

---

## 🏗️ Role of Envoy in the System

Here’s what Envoy does in your architecture:

```text
+---------------------+         gRPC-Web (HTTP/1.1)
|    React Frontend   |  <----------------------------->
+---------------------+                                |
                    |                                  |
                    v                                  v
+---------------------+         Native gRPC (HTTP/2)    |
|     Envoy Proxy     |  <----------------------------> |
+---------------------+                                |
                    |                                  |
                    v                                  v
+---------------------+                        +----------------------+
|   gRPC Go Backend    |                        |   Docker Controller  |
+---------------------+                        +----------------------+
```

---

## 🧪 Development Setup

If you're running this locally with Docker Compose, your `docker-compose.yml` likely includes something like:

```yaml
envoy:
  image: envoyproxy/envoy:v1.29-latest
  ports:
    - "8080:8080"
  volumes:
    - ./docker/envoy.yaml:/etc/envoy/envoy.yaml
  depends_on:
    - server
```

This ensures:

- Envoy is available at `http://localhost:8081`
- The frontend can talk to the backend by targeting this port

---

## 🔄 Flow Summary

1. **React sends a gRPC-Web request** (e.g., `UploadProject()`).
2. **Envoy receives it on port 8080**, parses the message, and unwraps the gRPC-Web encoding.
3. **Envoy converts it into a native gRPC request** and forwards it to the Go server (port 8080).
4. **The backend processes the request** and returns a native gRPC response.
5. **Envoy wraps the response back into gRPC-Web** and sends it to the browser.

---

## ✅ Benefits of Using Envoy

- Enables seamless use of gRPC in the browser.
- Handles CORS, HTTP upgrades, and streaming where needed.
- Production-ready with load balancing, retries, timeouts, and observability.
- Acts as a central point to **route and secure** traffic in future multi-service setups.

---

## 🧰 Debugging Tips

- To see Envoy logs, use:

  ```bash
  docker logs envoy
  ```

- If the frontend can’t reach the backend:
  - Make sure the gRPC service name (`server`) matches your Docker Compose service name.
  - Ensure ports `8080` (Envoy) and `8081` (gRPC server) are exposed and correctly configured.

---

## 📚 Further Reading

- [gRPC-Web Overview](https://grpc.io/docs/platforms/web/)
- [Envoy gRPC-Web Filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/grpc_web_filter)
- [Official Envoy Docs](https://www.envoyproxy.io/docs)
