#!/bin/bash

set -e

LOG_FILE="/home/ubuntu/startup.log"

{
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

  # Install dependencies in frontend and backend
  echo "Installing dependencies..."
  cd "$TARGET_DIR"

  if [ -d "frontend" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    sudo npm i
    cd ..
  fi

  if [ -d "backend" ]; then
    echo "Installing backend dependencies..."
    cd backend
    sudo npm i
    cd ..
  fi

  # Start Code Server
  echo "Starting Code Server..."
  exec /usr/bin/code-server \
    --auth none \
    --host 0.0.0.0 \
    --port 8080 \
    "$TARGET_DIR"

  # Send callback to your server
  TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-awstats-ec2-metadata-token-ttl-seconds: 21600")
  WEBHOOK_URL="https://8a871d63fd37.ngrok-free.app/api/containers/webhooks"
  INSTANCE_ID=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
  PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)
  curl -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" -d "{\"instance_id\":\"$INSTANCE_ID\",\"public_ip\":\"$PUBLIC_IP\",\"status\":\"ready\"}"
} | tee -a "$LOG_FILE"