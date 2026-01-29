# Stage 1: Build
FROM node:18-slim AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# SECURE AUTH & INSTALL
# 1. Mount the secret 'jfrog_token'.
# 2. Configure npm to point @mapcore scope to your registry.
# 3. 'npm install' runs, fetching the package and triggering 'postinstall'.
RUN --mount=type=secret,id=jfrog_token \
    npm config set @mapcore:registry https://mapcore.jfrog.io/artifactory/api/npm/npm/ && \
    npm config set //mapcore.jfrog.io/artifactory/api/npm/npm/:_authToken=$(cat /run/secrets/jfrog_token) && \
    npm install

# Copy source code
COPY . .

# Build Vite App (with baked-in .env secrets)
RUN --mount=type=secret,id=env_file,target=/app/.env \
    npm run build

# Stage 2: Production Server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
