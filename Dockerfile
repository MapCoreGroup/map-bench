FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built application to nginx html directory
COPY dist/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (will be mapped to 8080 via docker-compose)
EXPOSE 80 443

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

