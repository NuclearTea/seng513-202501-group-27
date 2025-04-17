# ===== Paths =====
PROTO_DIR       := proto
GO_OUT_DIR      := ../
TS_OUT_DIR      := UI/src/proto
ENVOY_CONFIG    := envoy.yaml

# ===== Binaries =====
PROTOC          := protoc
GO              := go
VITE            := npm run dev
ENVOY           := envoy

# ===== Proto plugin paths =====
PROTOC_GEN_TS_PROTO := UI/node_modules/.bin/protoc-gen-ts_proto

# ===== Files =====
PROTO_FILES     := $(wildcard $(PROTO_DIR)/*.proto)

# ===== Targets =====
.PHONY: all proto-go proto-web run-backend run-frontend run-envoy clean

all: proto-go proto-web

proto-go:
	@echo "🛠️  Generating Go gRPC files..."
	@mkdir -p $(GO_OUT_DIR)
	$(PROTOC) \
		--proto_path=$(PROTO_DIR) \
		--go_out=$(GO_OUT_DIR) \
		--go-grpc_out=$(GO_OUT_DIR) \
		$(PROTO_FILES)

proto-web:
	@echo "🌐 Generating Web (ts-proto) gRPC files..."
	@mkdir -p $(TS_OUT_DIR)
	$(PROTOC) \
		--plugin=$(PROTOC_GEN_TS_PROTO) \
		--ts_proto_out=$(TS_OUT_DIR) \
		--ts_proto_opt=outputEncodeMethods=false,outputJsonMethods,outputClientImpl=true \
		--proto_path=$(PROTO_DIR) \
		$(PROTO_FILES)

run-backend:
	@echo "🚀 Running Go gRPC backend..."
	cd server && $(GO) run main.go

run-frontend:
	@echo "🌱 Running Vite dev server..."
	cd UI && $(VITE)

run-envoy:
	@echo "🧭 Running Envoy proxy..."
	$(ENVOY) -c $(ENVOY_CONFIG) --log-level info

clean:
	@echo "🧹 Cleaning generated proto output..."
	@rm -rf gen/
	@rm -f UI/src/proto/*.ts
