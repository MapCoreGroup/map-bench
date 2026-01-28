# Stage 1: Build the React application
FROM node:18-slim AS build
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx files and copy build output
RUN rm -rf ./*
COPY --from=build /app/dist .

# Copy a custom nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
