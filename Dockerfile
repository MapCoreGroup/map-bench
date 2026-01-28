# Use a slim Python base for efficiency
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (essential for many map/GIS tools)
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set the entry point (Adjust based on which script you want to run)
CMD ["python", "main.py"]
