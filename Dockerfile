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

# Build Vite application using the .env secret mount
RUN --mount=type=secret,id=env_file,target=/app/.env \
    npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
