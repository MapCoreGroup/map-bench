#!/bin/bash

# Build Integration Environment Script
# Builds the Vite application and serves it via nginx in Docker on port 8080

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="map-bench-integration"
IMAGE_NAME="map-bench-integration"
PORT=8080

echo -e "${GREEN}=== Building Integration Environment ===${NC}\n"

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo -e "${RED}Error: docker-compose is not available. Please install docker-compose.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Warning: node_modules not found. Running npm install...${NC}"
    npm install
fi

# Parse command line arguments
CLEAN=false
FOLLOW_LOGS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean|-c)
            CLEAN=true
            shift
            ;;
        --logs|-l)
            FOLLOW_LOGS=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -c, --clean    Clean up old containers and images before building"
            echo "  -l, --logs     Follow logs after starting container"
            echo "  -h, --help     Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Enhanced cleanup function
cleanup_container() {
    echo -e "${YELLOW}Cleaning up container...${NC}"
    # First, try to stop and remove using docker directly (bypasses docker-compose metadata issues)
    CONTAINER_ID=$(docker ps -a --filter "name=${CONTAINER_NAME}" --format "{{.ID}}" 2>/dev/null || echo "")
    if [ ! -z "$CONTAINER_ID" ]; then
        echo "Found container ID: ${CONTAINER_ID}, stopping and removing..."
        docker stop ${CONTAINER_ID} 2>/dev/null || true
        docker kill ${CONTAINER_ID} 2>/dev/null || true
        docker rm -f ${CONTAINER_ID} 2>/dev/null || true
    fi
    # Also try by name
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker kill ${CONTAINER_NAME} 2>/dev/null || true
    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
    # Then try docker-compose (may fail if metadata is corrupted, but that's OK)
    ${DOCKER_COMPOSE_CMD} down --remove-orphans 2>/dev/null || true
    # Remove any volumes associated with the container
    docker volume ls --filter "name=${CONTAINER_NAME}" -q | xargs -r docker volume rm 2>/dev/null || true
}

# Check if .env file exists and validate required variables
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Environment variables may not be set.${NC}"
    echo "Make sure VITE_GOOGLE_3D_TILES_URL and VITE_WAYBACK_MAPTILES_WMTS_URL are set."
else
    echo -e "${GREEN}Checking environment variables...${NC}"
    if ! grep -q "VITE_GOOGLE_3D_TILES_URL" .env 2>/dev/null; then
        echo -e "${YELLOW}Warning: VITE_GOOGLE_3D_TILES_URL not found in .env${NC}"
    fi
    if ! grep -q "VITE_WAYBACK_MAPTILES_WMTS_URL" .env 2>/dev/null; then
        echo -e "${YELLOW}Warning: VITE_WAYBACK_MAPTILES_WMTS_URL not found in .env${NC}"
    fi
fi

# Clean up old containers and images if requested
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}Cleaning up old containers and images...${NC}"
    
    cleanup_container
    
    # Remove existing image
    if docker images --format '{{.Repository}}' | grep -q "^${IMAGE_NAME}$"; then
        echo "Removing existing image..."
        docker rmi ${IMAGE_NAME} 2>/dev/null || true
    fi
    
    echo -e "${GREEN}Cleanup complete.${NC}\n"
fi

# Build the application
echo -e "${GREEN}Step 1: Building application...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - dist folder not found.${NC}"
    exit 1
fi

echo -e "${GREEN}Build complete.${NC}\n"

# Always clean up before building/starting to avoid metadata issues
cleanup_container

# Build and start Docker container
echo -e "${GREEN}Step 2: Building Docker image...${NC}"
${DOCKER_COMPOSE_CMD} build

echo -e "${GREEN}Step 3: Starting container...${NC}"
${DOCKER_COMPOSE_CMD} up -d --force-recreate --remove-orphans

# Wait a moment for container to start
sleep 2

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "\n${GREEN}✓ Integration environment is running!${NC}\n"
    echo -e "Access the application at: ${GREEN}http://localhost:${PORT}${NC}\n"
    echo -e "Container status:"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    if [ "$FOLLOW_LOGS" = true ]; then
        echo -e "\n${YELLOW}Following logs (Ctrl+C to exit)...${NC}\n"
        ${DOCKER_COMPOSE_CMD} logs -f
    else
        echo -e "\nTo view logs: ${YELLOW}${DOCKER_COMPOSE_CMD} logs -f${NC}"
        echo -e "To stop: ${YELLOW}${DOCKER_COMPOSE_CMD} down${NC}"
    fi
else
    echo -e "${RED}Error: Container failed to start.${NC}"
    echo "Checking logs..."
    ${DOCKER_COMPOSE_CMD} logs
    exit 1
fi

