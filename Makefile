
# Paths
PROTO_SRC := proto/greeter.proto
PROTO_DIR := proto
GO_OUT := ./gen/go
WEB_OUT := UI/gen/web

# Targets
.PHONY: all go web clean

all: go web

go:
	@echo "Generating Go gRPC code..."
	@mkdir -p $(GO_OUT)
	protoc -I=$(PROTO_DIR) \
		--go_out=paths=source_relative:$(GO_OUT) \
		--go-grpc_out=paths=source_relative:$(GO_OUT) \
		$(PROTO_SRC)


web:
	@echo "Generating Web gRPC-Web code for frontend..."
	@mkdir -p $(WEB_OUT)
	protoc -I=$(PROTO_DIR) \
		--js_out=import_style=commonjs:$(WEB_OUT) \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:$(WEB_OUT) \
		$(PROTO_SRC)

clean:
	@echo "Cleaning generated files..."
	rm -rf $(GO_OUT)/*
	rm -rf $(WEB_OUT)/*


check-tools:
	@command -v protoc-gen-go >/dev/null || (echo "Missing protoc-gen-go"; exit 1)
	@command -v protoc-gen-go-grpc >/dev/null || (echo "Missing protoc-gen-go-grpc"; exit 1)
	@command -v protoc-gen-grpc-web >/dev/null || (echo "Missing protoc-gen-grpc-web"; exit 1)

