#!/bin/bash

set -uo pipefail
LOG_FILE="/home/ubuntu/startup.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "🟢 Interview environment setup started at $(date)"

CHALLENGE_REPO_URL="https://github.com/Otellu/pizza-shop-challenge.git"
TARGET_DIR="/home/ubuntu/interviewer-env/workspace/pizza-shop-challenge"

# Clone repo only if not already cloned
if [ ! -d "$TARGET_DIR" ]; then
  echo "📥 Cloning assignment repo into $TARGET_DIR..."
  sudo git clone "$CHALLENGE_REPO_URL" "$TARGET_DIR"
else
  echo "✅ Repo already exists at $TARGET_DIR"
fi

# Install Node.js, npm, and Yarn if not already present
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js is already installed: $(node -v)"
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "📦 Installing Yarn..."
  sudo corepack enable
  sudo corepack prepare yarn@stable --activate
else
  echo "Yarn is already installed: $(yarn -v)"
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

# Start Code Server
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

# Send callback to your server
echo "📡 Sending setup complete webhook..."

TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-awstats-ec2-metadata-token-ttl-seconds: 21600")
WEBHOOK_URL=" https://ac2641adecb3.ngrok-free.app/api/containers/webhooks"
INSTANCE_ID=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)

curl -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" \
  -d "{\"instance_id\":\"$INSTANCE_ID\",\"public_ip\":\"$PUBLIC_IP\",\"status\":\"ready\"}" \
  || echo "❌ Webhook failed"

echo "✅ Webhook sent. Logs at $LOG_FILE"

# Attach foreground to code-server
wait $CODE_SERVER_PID