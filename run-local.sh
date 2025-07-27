#!/bin/bash
BACKEND_ENV=$(cat << EOF
MONGO_URI=mongodb://pizzauser:pizzapass@mongo-db:27017/testdb?authSource=testdb
PORT=5000
JWT_SECRET=secret
EOF
)

FRONTEND_ENV=$(cat << EOF
REACT_APP_BASE_PATH=/absproxy/4200
EOF
)

EXTRA_INSTALL_COMMANDS=$(cat << EOC
sudo npm i -g @angular/cli
sudo which npm
EOC
)

ENV_CONTENT=$(cat <<EOF
API_URL_VAR_NAME=NG_APP_URL
NG_APP_BASE_PATH=/absproxy/4200
INTERVIEW_TAKEN_ID=test123
AWS_ACCESS_KEY_ID=test123
AWS_BUCKET=test123
AWS_SECRET_ACCESS_KEY=test123
AWS_REGION=eu-central-1
REPO_NAME=interview-env
REPO_URL=https://github.com/Otellu/pizza-shop-challenge.git
SUBDOMAIN=interview-env
WEBHOOK_URL=https://flexible-sound-mustang.ngrok-free.app
ENVIRONMENT=dev
FRONTEND_ENV_TEMPLATE=$(echo "$FRONTEND_ENV" | base64)
BACKEND_ENV_TEMPLATE=$(echo "$BACKEND_ENV" | base64)
EXTRA_INSTALL_COMMANDS=$(echo "$EXTRA_INSTALL_COMMANDS" | base64)
EOF
)

ENCODED_ENV=$(echo "$ENV_CONTENT" | base64)
eval "$(echo "$ENCODED_ENV" | base64 -d | sed 's/^/export /')"
docker compose up --build
