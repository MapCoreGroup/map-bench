# Stage 1: Build
FROM node:22 AS builder
WORKDIR /app

# Registry env matching SR logic
ENV npm_config_registry=https://mapcore.jfrog.io/artifactory/api/npm/npm-virtual/

COPY package.json ./
COPY .npmrc ./

# Keep JFROG_TOKEN as a secret mount because it is a credential for npm install
# This is secure and correct.
RUN --mount=type=secret,id=jfrog_token \
    JFROG_TOKEN=$(cat /run/secrets/jfrog_token) npm install

COPY . .

# --- NEW SECTION: CLEAN ARGUMENTS ---
# We declare the arguments we expect from GitHub Actions
ARG VITE_MAPBOX_TOKEN
ARG VITE_GOOGLE_API_KEY
ARG VITE_CESIUM_TOKEN
ARG VITE_MAPTILER_KEY
ARG VITE_MAPCORE_SERVER_URL
ARG VITE_GOOGLE_3D_TILES_URL
ARG VITE_WAYBACK_MAPTILES_WMTS_URL
ARG VITE_WMTS_LAYERS_LIST
ARG VITE_WMTS_TILING_SCHEME

# We set them as Environment Variables so Vite can "bake" them into the app
ENV VITE_MAPBOX_TOKEN=$VITE_MAPBOX_TOKEN
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY
ENV VITE_CESIUM_TOKEN=$VITE_CESIUM_TOKEN
ENV VITE_MAPTILER_KEY=$VITE_MAPTILER_KEY
ENV VITE_MAPCORE_SERVER_URL=$VITE_MAPCORE_SERVER_URL
ENV VITE_GOOGLE_3D_TILES_URL=$VITE_GOOGLE_3D_TILES_URL
ENV VITE_WAYBACK_MAPTILES_WMTS_URL=$VITE_WAYBACK_MAPTILES_WMTS_URL
ENV VITE_WMTS_LAYERS_LIST=$VITE_WMTS_LAYERS_LIST
ENV VITE_WMTS_TILING_SCHEME=$VITE_WMTS_TILING_SCHEME

# Now build the app. Vite will automatically pick up the ENV vars above.
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
