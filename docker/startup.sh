#!/bin/bash

set -e

CHALLENGE_REPO_URL="https://github.com/Otellu/pizza-shop-challenge.git"
TARGET_DIR="/home/ubuntu/interviewer-env/workspace"

# Clone repo only if not already cloned
if [ ! -d "$TARGET_DIR" ]; then
  echo "Cloning assignment repo into $TARGET_DIR..."
  sudo git clone "$CHALLENGE_REPO_URL" "$TARGET_DIR"
else
  echo "Repo already exists at $TARGET_DIR"
fi

# Install Node.js, npm, and Yarn if not already present
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js is already installed: $(node -v)"
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "Installing Yarn..."
  sudo corepack enable
  sudo corepack prepare yarn@stable --activate
else
  echo "Yarn is already installed: $(yarn -v)"
fi

# Start Code Server
echo "Starting Code Server..."
exec /usr/bin/code-server \
  --auth none \
  --host 0.0.0.0 \
  --port 8080 \
  "$TARGET_DIR"
