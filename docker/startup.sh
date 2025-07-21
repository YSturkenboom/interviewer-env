#!/bin/bash
# docker/startup.sh
set -uo pipefail

echo "🟢 Interview environment setup started at $(date)"

# These env variables ensure that the code-server instance starts with the correct proxy setup for a create-react-app project
export PUBLIC_URL="/absproxy/3000"
export WDS_SOCKET_PATH="/absproxy/3000/sockjs-node"
export BROWSER="none"
export VSCODE_PROXY_URI="/absproxy/{{port}}"

# Extract subdomain prefix and UUID from SUBDOMAIN
SESSION_ID=$(echo "$SUBDOMAIN" | sed 's/\.[^.]*$//')

TARGET_DIR="/home/ubuntu/interviewer-env/workspace/$REPO_NAME"
  
# Clone repo only if not already cloned
if [ ! -d "$TARGET_DIR" ]; then
  echo ":inbox_tray: Cloning assignment repo into $TARGET_DIR..."
  sudo git clone "$REPO_URL" "$TARGET_DIR"
  # Find and start all npm projects inside the repo
  echo ":rocket: Setting up projects inside $TARGET_DIR"
  for dir in "$TARGET_DIR"/*/; do
    if [ -f "$dir/package.json" ]; then
      echo ":file_folder: Found project: $dir"
      (
        cd "$dir"
        echo ":package: Installing dependencies..."
        sudo npm install
      )
    fi
  done

  # Wait for all background `npm start` processes
  wait
else
  echo ":white_check_mark: Repo already exists at $TARGET_DIR"
fi

# Set proper ownership
sudo chown -R coder:coder "$TARGET_DIR"

# Install Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "📦 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "✅ Node.js is already installed: $(node -v)"
fi

echo "SESSION_ID: $SESSION_ID"

# 🔗 Create the right environment variables for the projects
echo "🔗 Creating environment variables for frontend..."
cd $TARGET_DIR/frontend
sudo cat > .env <<EOF
REACT_APP_API_URL=https://${SESSION_ID}.com/proxy/5000/api
REACT_APP_BASE_PATH=/absproxy/3000
EOF

cd $TARGET_DIR/backend
sudo cat > .env <<EOF
MONGO_URI=mongodb://pizzauser:pizzapass@mongo-db:27017/testdb?authSource=testdb
PORT=5000
JWT_SECRET=secret
EOF

# 🚀 Start API server in background (from correct directory)
echo "🛠 Starting API Server..."
cd /home/coder && node api-server.js &
API_SERVER_PID=$!

# Wait for API server to start
echo "⏳ Waiting for API server..."
for i in {1..15}; do
  if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo "✅ API Server is up!"
    break
  else
    echo "⏱ Waiting for API server... ($i)"
    sleep 2
  fi
done

# Test API server manually if still not working
if ! curl -s http://localhost:9000/health > /dev/null 2>&1; then
  echo "❌ API Server failed to start. Checking process..."
  if ps -p $API_SERVER_PID > /dev/null 2>&1; then
    echo "API server process is running but not responding"
  else
    echo "API server process died. Checking logs..."
    # Try to start it manually to see errors
    echo "Attempting to start API server manually..."
    cd /home/coder && node api-server.js &
    NEW_API_PID=$!
    sleep 3
    if ps -p $NEW_API_PID > /dev/null 2>&1; then
      API_SERVER_PID=$NEW_API_PID
      echo "✅ API Server started manually"
    else
      echo "❌ API Server failed to start manually"
    fi
  fi
fi

# 📦 Install the diff tracker extension
echo "🚀 Installing diff tracker extension..."
/usr/bin/code-server --install-extension /tmp/my-extension.vsix

# 📦 a) Install MongoDB extension
echo "🚀 Installing MongoDB extension..."
/usr/bin/code-server --install-extension mongodb.mongodb-vscode

# 🔧 Setting up IDE settings before starting code-server
echo "🔧 Setting up IDE settings..."
sudo cat > /home/coder/.local/share/code-server/User/settings.json <<EOF
{
  "markdown.preview.openMarkdownLinks": "inPreview",
  "workbench.editorAssociations": {
      "*.md": "vscode.markdown.preview.editor"
  },
  "mdb.presetConnections": [
    {
      "name": "Code Challenge Database",
      "connectionString": "mongodb://pizzauser:pizzapass@mongo-db:27017/testdb?authSource=testdb"
    }
  ],
  "security.workspace.trust.enabled": false
}
EOF

# 🔁 Start code-server in background - POINT DIRECTLY TO CHALLENGE DIRECTORY
echo "🚀 Starting Code Server..."
echo "📂 Opening workspace: $TARGET_DIR"
/usr/bin/code-server \
  --auth none \
  --host 0.0.0.0 \
  --port 8080 \
  "$TARGET_DIR" &

CODE_SERVER_PID=$!

# Wait for Code Server
echo "⏳ Waiting for Code Server..."
for i in {1..30}; do
  if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Code Server is up!"
    break
  else
    echo "⏱ Waiting... ($i)"
    sleep 2
  fi
done

# ✅ GET SUBDOMAIN FROM ENVIRONMENT VARIABLES
echo "📖 Reading configuration from environment variables..."

# Get the metadata token
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# Validate token
if [ -z "$TOKEN" ]; then
  echo "❌ Failed to retrieve EC2 metadata token"
  exit 1
fi

# Set the webhook URL from environment or use fallback
WEBHOOK_URL="${WEBHOOK_URL:-https://cruit-europe.com/api/containers/webhooks}"

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

# Validate required environment variables
echo "📋 Environment variables:"
echo "  SUBDOMAIN: ${SUBDOMAIN:-'NOT SET'}"
echo "  INTERVIEW_TAKEN_ID: ${INTERVIEW_TAKEN_ID:-'NOT SET'}"
echo "  WEBHOOK_URL: ${WEBHOOK_URL:-'NOT SET'}"
echo "  REPO_URL: ${REPO_URL:-'NOT SET'}"

# Exit if SUBDOMAIN is missing
if [ -z "${SUBDOMAIN:-}" ]; then
  echo "❌ SUBDOMAIN environment variable is required but not set!"
  echo "Make sure docker-compose.yml passes SUBDOMAIN from userDataScript"
  exit 1
fi

# Set other variables with fallbacks
INTERVIEW_TAKEN_ID="${INTERVIEW_TAKEN_ID:-unknown}"
CHALLENGE_REPO="${REPO_URL:-https://github.com/Otellu/pizza-shop-challenge.git}"

# Construct the session URL
SESSION_URL="https://${SUBDOMAIN}"

# Prepare webhook payload
WEBHOOK_PAYLOAD=$(cat <<EOF
{
  "instance_id": "$INSTANCE_ID",
  "public_ip": "$PUBLIC_IP",
  "session_url": "$SESSION_URL",
  "subdomain": "${SUBDOMAIN}",
  "interview_taken_id": "$INTERVIEW_TAKEN_ID",
  "challenge_repo": "$CHALLENGE_REPO",
  "workspace_path": "$TARGET_DIR",
  "status": "ready",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)"
}
EOF
)

# Send webhook with retry logic
echo "📡 Sending webhook to: $WEBHOOK_URL"
echo "📡 Webhook payload: $WEBHOOK_PAYLOAD"
WEBHOOK_SUCCESS=false
for i in {1..3}; do
  echo "📡 Webhook attempt $i/3..."
  echo "curl -s -L -w POST ${WEBHOOK_URL}";
  WEBHOOK_RESPONSE=$(curl -s -L -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "$WEBHOOK_PAYLOAD")
  
  # Extract HTTP status code (last line)
  HTTP_STATUS=$(echo "$WEBHOOK_RESPONSE" | tail -n1)
  RESPONSE_BODY=$(echo "$WEBHOOK_RESPONSE" | head -n -1)
  
  if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 201 ]; then
    echo "✅ Webhook sent successfully (HTTP $HTTP_STATUS)"
    echo "📋 Response: $RESPONSE_BODY"
    WEBHOOK_SUCCESS=true
    break
  else
    echo "❌ Webhook failed (HTTP $HTTP_STATUS)"
    echo "📋 Response: $RESPONSE_BODY"
    if [ $i -lt 3 ]; then
      echo "⏱ Retrying in 5 seconds..."
      sleep 5
    fi
  fi
done

if [ "$WEBHOOK_SUCCESS" = false ]; then
  echo "❌ All webhook attempts failed"
fi

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

# Print final status
echo "========================================"
echo "🎉 Setup completed!"
echo "📂 Workspace: $TARGET_DIR"
echo "🔗 Code Server: http://localhost:8080"
echo "🛠 API Server: http://localhost:9000"
echo "🌐 Session URL: $SESSION_URL"
echo "========================================"

# 🔒 Wait for both processes
echo "🔒 All services running. Waiting for shutdown signal..."
wait $CODE_SERVER_PID
