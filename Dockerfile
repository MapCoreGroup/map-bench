# Stage 1: Build the React/Vite app
FROM node:18-slim AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Mount the secret to access the JFROG_TOKEN during install
RUN --mount=type=secret,id=env_file \
    export $(grep -v '^#' /run/secrets/env_file | xargs) && \
    if [ ! -z "$JFROG_TOKEN" ]; then \
      echo "//your-jfrog-url/:_authToken=$JFROG_TOKEN" > .npmrc; \
    fi && \
    npm install

COPY . .

# Mount it again for the actual build to bake in VITE_ variables
RUN --mount=type=secret,id=env_file,target=/app/.env \
    npm run build
# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
