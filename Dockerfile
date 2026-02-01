# Stage 1: Build
FROM node:22 AS builder
WORKDIR /app

# Registry env matching SR logic
ENV npm_config_registry=https://mapcore.jfrog.io/artifactory/api/npm/npm-virtual/

COPY package.json ./
COPY .npmrc ./

# This line mirrors the SR 'RUN --mount' command exactly
# It reads the secret provided by the GitHub Action
RUN --mount=type=secret,id=jfrog_token \
    JFROG_TOKEN=$(cat /run/secrets/jfrog_token) npm install

COPY . .

# DEEP CHECK VERSION:
# 1. Mount the secret to a temporary default path (/run/secrets/env_file)
# 2. Copy it manually to .env so we can inspect it
# 3. Verify it has content
# 4. Build
RUN --mount=type=secret,id=env_file \
    cp /run/secrets/env_file .env && \
    echo "--- 🔍 DEBUG: Verifying .env file ---" && \
    ls -la .env && \
    if grep -q "VITE_" .env; then echo "✅ FOUND VITE_ VARIABLES"; else echo "❌ ERROR: NO VITE_ VARIABLES FOUND"; exit 1; fi && \
    npm run build

# Build Vite application using the .env secret mount
# RUN --mount=type=secret,id=env_file,target=/app/.env \
#     npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
