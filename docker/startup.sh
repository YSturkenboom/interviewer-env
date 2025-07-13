#!/bin/bash
# docker/startup.sh

set -uo pipefail

echo "🟢 Interview environment setup started at $(date)"

# Create base directory if it doesn't exist (with proper permissions)
echo "📁 Setting up workspace directory..."
if [ ! -d "/home/ubuntu/interviewer-env/workspace" ]; then
  echo "Creating workspace directory..."
  mkdir -p /home/ubuntu/interviewer-env/workspace 2>/dev/null || {
    echo "⚠️ Cannot create workspace as coder user, directory should exist from Docker build"
  }
fi

# Ensure proper ownership (if needed)
if [ ! -w "/home/ubuntu/interviewer-env/workspace" ]; then
  echo "⚠️ Workspace not writable, this may cause issues"
fi

# Check if REPO_URL and REPO_NAME are set
if [ -z "${REPO_URL:-}" ] || [ -z "${REPO_NAME:-}" ]; then
  echo "⚠️ REPO_URL or REPO_NAME not set. Creating default workspace..."
  echo "REPO_URL: ${REPO_URL:-'not set'}"
  echo "REPO_NAME: ${REPO_NAME:-'not set'}"
  TARGET_DIR="/home/ubuntu/interviewer-env/workspace/default-workspace"
  mkdir -p "$TARGET_DIR"
  
  # Create a simple default setup
  cat > "$TARGET_DIR/README.md" << 'EOF'
# Interview Workspace

This is your interview coding environment.

## Available Tools
- Node.js and npm
- MongoDB (available at localhost:27017)
- Code editor with extensions

## API Endpoints
- Save workspace: POST /api/save-workspace
- Health check: GET /health

Happy coding!
EOF

else
  TARGET_DIR="/home/ubuntu/interviewer-env/workspace/$REPO_NAME"
  
  # Clone repo only if not already cloned
  if [ ! -d "$TARGET_DIR" ]; then
    echo "📥 Cloning assignment repo into $TARGET_DIR..."
    git clone "$REPO_URL" "$TARGET_DIR" || {
      echo "❌ Failed to clone repo. Creating default workspace..."
      TARGET_DIR="/home/ubuntu/interviewer-env/workspace/default-workspace"
      mkdir -p "$TARGET_DIR"
    }
  else
    echo "✅ Repo already exists at $TARGET_DIR"
  fi
fi

# Install Node.js, npm, and Yarn if not already present
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "✅ Node.js is already installed: $(node -v)"
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "📦 Installing Yarn..."
  sudo corepack enable
  sudo corepack prepare yarn@stable --activate
else
  echo "✅ Yarn is already installed: $(yarn -v)"
fi

# Install frontend dependencies
cd "$TARGET_DIR" || exit 1

if [ -d "frontend" ]; then
  cd frontend
  echo "⚙️ Setting up frontend..."
  sudo tee .env > /dev/null << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF
  sudo npm install || echo "❌ Frontend install failed"
  cd ..
fi

# Install backend dependencies
if [ -d "backend" ]; then
  cd backend
  echo "⚙️ Setting up backend..."
  sudo tee .env > /dev/null << EOF
MONGO_URI=mongodb+srv://admininterview:test123@devcluster.gifvk5p.mongodb.net/pizza-shop?retryWrites=true&w=majority&appName=DevCluster
PORT=5000
JWT_SECRET=secret
EOF
  sudo npm install || echo "❌ Backend install failed"
  cd ..
fi

# 🚀 Start API server in background
echo "🛠️ Starting API Server..."
node /home/coder/api-server.js &
API_SERVER_PID=$!

# Wait for API server to start
echo "⏳ Waiting for API server..."
for i in {1..15}; do
  if curl -s http://localhost:9000/health > /dev/null; then
    echo "✅ API Server is up!"
    break
  else
    echo "⏱️ Waiting for API server... ($i)"
    sleep 2
  fi
done

# 🔁 Start code-server in background
echo "🚀 Starting Code Server..."
/usr/bin/code-server \
  --auth none \
  --host 0.0.0.0 \
  --port 8080 \
  "$TARGET_DIR" &

CODE_SERVER_PID=$!

# Wait for Code Server
echo "⏳ Waiting for Code Server..."
for i in {1..30}; do
  if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Code Server is up!"
    break
  else
    echo "⏱️ Waiting... ($i)"
    sleep 2
  fi
done

# Get the metadata token
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# Validate token
if [ -z "$TOKEN" ]; then
  echo "❌ Failed to retrieve EC2 metadata token"
  exit 1
fi

# Set the webhook URL
WEBHOOK_URL="https://ac2641adecb3.ngrok-free.app/api/containers/webhooks"

# Get instance ID and public IP
INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/instance-id)

PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/public-ipv4)

# Validate values
if [ -z "$INSTANCE_ID" ] || [ -z "$PUBLIC_IP" ]; then
  echo "❌ Failed to retrieve instance metadata"
  exit 1
fi

# Send webhook
echo "📡 Sending webhook..."
curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"instance_id\":\"$INSTANCE_ID\",\"public_ip\":\"$PUBLIC_IP\",\"status\":\"ready\"}" \
  && echo "✅ Webhook sent." \
  || echo "❌ Webhook failed"

# Function to handle shutdown gracefully
cleanup() {
  echo "🛑 Shutting down services..."
  
  # Kill API server
  if [ ! -z "$API_SERVER_PID" ]; then
    kill $API_SERVER_PID 2>/dev/null || true
    echo "🛑 API Server stopped"
  fi
  
  # Kill code server
  if [ ! -z "$CODE_SERVER_PID" ]; then
    kill $CODE_SERVER_PID 2>/dev/null || true
    echo "🛑 Code Server stopped"
  fi
  
  # Trigger final workspace save
  echo "💾 Triggering final workspace save..."
  curl -s -X POST http://localhost:9000/api/save-workspace \
    -H "Content-Type: application/json" \
    || echo "❌ Final save failed"
  
  exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# 🔒 Wait for both processes
echo "🔒 All services running. Waiting for shutdown signal..."
wait $CODE_SERVER_PID