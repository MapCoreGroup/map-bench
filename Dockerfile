# Stage 1: Builder
FROM node:22 AS builder
WORKDIR /app

# Matches SR's exact virtual registry path
ENV npm_config_registry=https://mapcore.jfrog.io/artifactory/api/npm/npm-virtual/

COPY package.json ./
COPY .npmrc ./

# SECURE INSTALL: Passes the token from the secret mount to the npm environment
RUN --mount=type=secret,id=jfrog_token \
    JFROG_TOKEN=$(cat /run/secrets/jfrog_token) npm install

COPY . .

# Build the Vite application with environment secrets
RUN --mount=type=secret,id=env_file,target=/app/.env \
    npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
