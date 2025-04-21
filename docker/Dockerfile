FROM envoyproxy/envoy:v1.29-latest

# Copy your envoy config
COPY envoy.yaml /etc/envoy/envoy.yaml

# Set the command to use your config
CMD ["envoy", "-c", "/etc/envoy/envoy.yaml"]
