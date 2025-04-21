#!/bin/bash

# ====== Configuration ======
RESOURCE_GROUP="SENG-513-Final-Project"
LOCATION="West US"
ENV_NAME="seng513-env"
ACR_NAME="webide"
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"

# ====== Log in to Azure & ACR ======
echo "🔐 Logging in to Azure..."
az login --only-show-errors

echo "🔐 Logging in to ACR..."
az acr login --name $ACR_NAME

# ====== Create Resource Group if it doesn't exist ======
echo "📦 Ensuring resource group exists..."
az group create --name $RESOURCE_GROUP --location "$LOCATION"

# ====== Create Container App Environment ======
echo "🌱 Creating Container App Environment: $ENV_NAME..."
az containerapp env create \
  --name $ENV_NAME \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"

# ====== Deploy UI (external) ======
echo "🚀 Deploying UI..."
az containerapp create \
  --name ui \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $ACR_LOGIN_SERVER/seng513-202501-group-27-ui:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER

# ====== Deploy gRPC Server (internal) ======
echo "🚀 Deploying gRPC server..."
az containerapp create \
  --name grpc-server \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $ACR_LOGIN_SERVER/seng513-202501-group-27-grpc-server:latest \
  --target-port 8080 \
  --ingress internal \
  --registry-server $ACR_LOGIN_SERVER

# ====== Deploy NGINX (external) ======
echo "🚀 Deploying NGINX..."
az containerapp create \
  --name nginx \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $ACR_LOGIN_SERVER/seng513-nginx:latest \
  --target-port 80 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER

# ====== Deploy Envoy (external) ======
echo "🚀 Deploying Envoy..."
az containerapp create \
  --name envoy \
  --resource-group $RESOURCE_GROUP \
  --environment $ENV_NAME \
  --image $ACR_LOGIN_SERVER/seng513-envoy:latest \
  --target-port 8081 \
  --ingress external \
  --registry-server $ACR_LOGIN_SERVER

# ====== Show URLs ======
echo "🌐 Fetching public URLs..."
echo "UI:"
az containerapp show --name ui --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv

echo "NGINX:"
az containerapp show --name nginx --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv

echo "ENVOY:"
az containerapp show --name envoy --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv

echo "✅ Deployment complete!"
