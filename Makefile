PROTO_SRC = proto/greeter.proto
PROTO_DIR = proto
GO_OUT = ../

all: go

go:
	@echo "Generating Go gRPC code..."
	@mkdir -p $(GO_OUT)
	protoc -I=$(PROTO_DIR) \
		--go_out=$(GO_OUT) \
		--go-grpc_out=$(GO_OUT) \
		$(PROTO_SRC)

clean:
	rm -rf ./gen/go
