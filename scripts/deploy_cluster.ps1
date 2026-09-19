<#
==============================================================================
VoteChain (CertiChain) Multi-Node Cluster Deployment Script (PowerShell)
ABC Institution of Technology — Enterprise Blockchain Cluster
==============================================================================
#>

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Starting VoteChain (CertiChain) Production Cluster Deployment" -ForegroundColor Cyan
Write-Host " ABC Institution of Technology — Decentralized Voting System" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# Check Docker availability
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in system PATH. Please install Docker Desktop."
    exit 1
}

# Step 1: Ensure persistent directories exist
Write-Host "[1/5] Initializing storage directories..." -ForegroundColor Yellow
if (-not (Test-Path "backend\blockchain_data")) { New-Item -ItemType Directory -Path "backend\blockchain_data" -Force | Out-Null }
if (-not (Test-Path "backend\media")) { New-Item -ItemType Directory -Path "backend\media" -Force | Out-Null }

# Step 2: Build container images
Write-Host "[2/5] Building production container images..." -ForegroundColor Yellow
docker compose build

# Step 3: Launch containers
Write-Host "[3/5] Starting database, redis, backend, and frontend containers..." -ForegroundColor Yellow
docker compose up -d

# Step 4: Run database migrations and seeding
Write-Host "[4/5] Executing database migrations & institution genesis seed..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker compose exec -T backend python manage.py migrate --noinput
docker compose exec -T backend python manage.py seed_abc_institution

# Step 5: Check container status
Write-Host "[5/5] Checking cluster container status..." -ForegroundColor Green
docker compose ps

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " VoteChain Cluster Deployed Successfully!" -ForegroundColor Green
Write-Host " Web Portal & Kiosk UI  : http://localhost:80" -ForegroundColor White
Write-Host " REST API & Core Engine : http://localhost:8000/api/" -ForegroundColor White
Write-Host " Public Verifier        : http://localhost:80/verify" -ForegroundColor White
Write-Host " CEO Command Center     : http://localhost:80/ceo" -ForegroundColor White
Write-Host " Admin Control Center   : http://localhost:80/admin/dashboard" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Cyan
