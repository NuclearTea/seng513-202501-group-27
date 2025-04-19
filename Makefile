PROTOC = protoc
PROTO_DIR = proto
GO_OUT_DIR = gen
TS_OUT_DIR = UI/src/proto
PROTO_FILES = $(wildcard $(PROTO_DIR)/*.proto)

.PHONY: all go web clean

all: go web

go:
	@echo "🛠️   Generating Go gRPC files..."
	@mkdir -p $(GO_OUT_DIR)
	$(PROTOC) \
		--proto_path=$(PROTO_DIR) \
		--go_out=$(GO_OUT_DIR) \
		--go-grpc_out=$(GO_OUT_DIR) \
		$(PROTO_FILES)

web:
	@echo "🌐 Generating Web (ts-proto) gRPC files..."
	# @mkdir -p $(TS_OUT_DIR)
	# $(PROTOC) \
	# 	--proto_path=$(PROTO_DIR) \
	# 	--js_out=import_style=commonjs,binary:$(TS_OUT_DIR) \
	# 	--grpc-web_out=import_style=typescript,mode=grpcwebtext:$(TS_OUT_DIR)\
	# 	$(PROTO_FILES)
	@mkdir -p $(TS_OUT_DIR)/greeter
	@mkdir -p $(TS_OUT_DIR)/filetree
	# Generate greeter
	$(PROTOC) \
		--proto_path=$(PROTO_DIR) \
		--js_out=import_style=commonjs:$(TS_OUT_DIR)/greeter \
		--grpc-web_out=import_style=typescript,mode=grpcwebtext:$(TS_OUT_DIR)/greeter \
		$(PROTO_DIR)/greeter.proto
	# Generate filetree
	$(PROTOC) \
		--proto_path=$(PROTO_DIR) \
		--js_out=import_style=commonjs:$(TS_OUT_DIR)/filetree \
		--grpc-web_out=import_style=typescript,mode=grpcwebtext:$(TS_OUT_DIR)/filetree \
		$(PROTO_DIR)/filetree.proto

clean:
	@echo "🧹 Cleaning generated proto output..."
	@rm -rf gen/
	@rm -f $(TS_OUT_DIR)/*.{ts,js}
