#!/bin/bash

REPO_URL="https://github.com/Otellu/pizza-shop-challenge.git"
TARGET_DIR="/home/coder/project/pizza-shop-challenge"

# Clone repo only if not already cloned. This is done by the startup EC2 UserData Script, so it's unlikely to be cloned here.
if [ ! -d "$TARGET_DIR" ]; then
  echo "Cloning assignment repo into $TARGET_DIR..."
  git clone "$REPO_URL" "$TARGET_DIR"
else
  echo "Repo already exists at $TARGET_DIR"
fi

# Start Code Server
exec /usr/bin/code-server --auth none --host 0.0.0.0 --port 8080 /home/coder/project