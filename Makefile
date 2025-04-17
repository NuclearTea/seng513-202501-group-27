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
.PHONY: all server web web2 run-backend run-frontend run-envoy clean

all: server web

server:
	"🛠️  Generating Go gRPC files..."
	@mkdir -p $(GO_OUT_DIR)
	$(PROTOC) \
		--proto_path=$(PROTO_DIR) \
		--go_out=$(GO_OUT_DIR) \
		--go-grpc_out=$(GO_OUT_DIR) \
		$(PROTO_FILES)

web:
	@echo "🌐 Generating Web (ts-proto) gRPC files..."
	@mkdir -p $(TS_OUT_DIR)
	$(PROTOC) \
		--plugin=$(PROTOC_GEN_TS_PROTO) \
		--ts_proto_out=$(TS_OUT_DIR) \
		--ts_proto_opt=outputEncodeMethods=false,outputJsonMethods,outputClientImpl=true \
		--proto_path=$(PROTO_DIR) \
		$(PROTO_FILES)

web2:
	@echo "web2!"
	# ui-2 should have proto folder
	# protoc -I=$(PROTO_DIR) \
	# 	--js_out=import_style=commonjs:$(WEB_OUT) \
	# 	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:$(WEB_OUT) \
	# 	$(PROTO_SRC)
	protoc  -I=proto \
		--js_out=import_style=commonjs:ui-2/src/proto \
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:ui-2/src/proto \
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
