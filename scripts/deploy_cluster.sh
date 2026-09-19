#!/usr/bin/env bash
# ==============================================================================
# VoteChain (CertiChain) Multi-Node Cluster Cold-Start Deployment Script
# ABC Institution of Technology — Enterprise Blockchain Cluster
# ==============================================================================

set -e

echo "======================================================================"
echo " Starting VoteChain (CertiChain) Production Cluster Deployment"
echo " ABC Institution of Technology — Decentralized Voting System"
echo "======================================================================"

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo "[ERROR] Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

# Step 1: Create storage directories
echo "[1/5] Initializing local storage volumes and keys..."
mkdir -p backend/blockchain_data
mkdir -p backend/media

# Step 2: Build container images
echo "[2/5] Building production container images..."
docker compose build

# Step 3: Spin up services in detached mode
echo "[3/5] Launching database, redis, backend, and frontend containers..."
docker compose up -d

# Step 4: Run database migrations and seed institution data
echo "[4/5] Running schema migrations and initial genesis block seeding..."
docker compose exec -T backend python manage.py migrate --noinput
docker compose exec -T backend python manage.py seed_abc_institution

# Step 5: Health check
echo "[5/5] Performing cluster health verification..."
sleep 3
docker compose ps

echo "======================================================================"
echo " VoteChain Cluster Deployed Successfully!"
echo " Web Portal & Kiosk UI : http://localhost:80"
echo " REST API & Core Engine : http://localhost:8000/api/"
echo " Public Verifier       : http://localhost:80/verify"
echo " CEO Command Center    : http://localhost:80/ceo"
echo " Admin Control Center  : http://localhost:80/admin/dashboard"
echo "======================================================================"
