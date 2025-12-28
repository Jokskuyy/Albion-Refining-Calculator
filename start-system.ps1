#!/usr/bin/env pwsh
# Albion Refining Calculator - Management Script
# Usage: .\start-system.ps1 [command]
# Commands: start, stop, restart, status, logs, dev, build

param(
    [Parameter(Position=0)]
    [ValidateSet('start', 'stop', 'restart', 'status', 'logs', 'dev', 'dev:daemon', 'build', 'install', 'help')]
    [string]$Command = 'help'
)

$ErrorActionPreference = "Stop"

function Show-Help {
    Write-Host ""
    Write-Host "=== Albion Refining Calculator - System Manager ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\start-system.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  install     - Install all dependencies (frontend & backend)" -ForegroundColor White
    Write-Host "  dev         - Start development mode (frontend & backend with hot-reload)" -ForegroundColor White
    Write-Host "  dev:daemon  - Start daemon in development mode (with file watching)" -ForegroundColor White
    Write-Host "  build       - Build production version" -ForegroundColor White
    Write-Host "  start       - Start system as daemon (production mode)" -ForegroundColor White
    Write-Host "  stop        - Stop daemon" -ForegroundColor White
    Write-Host "  restart     - Restart daemon" -ForegroundColor White
    Write-Host "  status      - Show daemon status" -ForegroundColor White
    Write-Host "  logs        - Show real-time logs" -ForegroundColor White
    Write-Host "  help        - Show this help" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Magenta
    Write-Host "  .\start-system.ps1 install" -ForegroundColor Gray
    Write-Host "  .\start-system.ps1 dev" -ForegroundColor Gray
    Write-Host "  .\start-system.ps1 start" -ForegroundColor Gray
    Write-Host "  .\start-system.ps1 status" -ForegroundColor Gray
    Write-Host ""
}

function Test-Dependencies {
    Write-Host "Checking dependencies..." -ForegroundColor Yellow
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "✗ Node.js not found. Please install Node.js" -ForegroundColor Red
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "✗ npm not found" -ForegroundColor Red
        exit 1
    }
}

function Install-Dependencies {
    Write-Host ""
    Write-Host "=== Installing Dependencies ===" -ForegroundColor Cyan
    Write-Host ""
    
    Test-Dependencies
    
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host ""
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    
    Write-Host ""
    Write-Host "✓ All dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

function Start-DevMode {
    Write-Host ""
    Write-Host "=== Starting Development Mode ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host "Backend:  http://localhost:3001" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
 

function Start-DevDaemon {
    Write-Host ""
    Write-Host "=== Starting Development Daemon (with file watching) ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if PM2 is installed
    try {
        $pm2Version = npx pm2 --version
    } catch {
        Write-Host "PM2 not found. Installing PM2..." -ForegroundColor Yellow
        npm install
    }
    
    # Create logs directory
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" | Out-Null
    }
    if (!(Test-Path "backend/logs")) {
        New-Item -ItemType Directory -Path "backend/logs" | Out-Null
    }
    
    Write-Host "Starting PM2 daemon in development mode..." -ForegroundColor Yellow
    npm run daemon:start:dev
    
    Write-Host ""
    Write-Host "✓ Development daemon started with file watching enabled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Backend will auto-restart on file changes" -ForegroundColor Yellow
    Write-Host "Frontend has hot-reload enabled" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Use '.\start-system.ps1 status' to check status" -ForegroundColor Gray
    Write-Host "Use '.\start-system.ps1 logs' to view logs" -ForegroundColor Gray
    Write-Host ""
}   npm run dev:full
}

function Build-Production {
    Write-Host ""
    Write-Host "=== Building Production Version ===" -ForegroundColor Cyan
    Write-Host ""
    
    npm run build
    
    Write-Host ""
    Write-Host "✓ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
}

function Start-Daemon {
    Write-Host ""
    Write-Host "=== Starting System as Daemon ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if PM2 is installed
    try {
        $pm2Version = pm2 --version
    } catch {
        Write-Host "PM2 not found. Installing PM2 globally..." -ForegroundColor Yellow
        npm install -g pm2
    }
    
    # Create logs directory
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" | Out-Null
    }
    if (!(Test-Path "backend/logs")) {
        New-Item -ItemType Directory -Path "backend/logs" | Out-Null
    }
    
    Write-Host "Building application..." -ForegroundColor Yellow
    npm run build
    
    Write-Host ""
    Write-Host "Starting PM2 daemon..." -ForegroundColor Yellow
    npm run daemon:start
    
    Write-Host ""
    Write-Host "✓ System started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:4173" -ForegroundColor Cyan
    Write-Host "Backend:  http://localhost:3001" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Use '.\start-system.ps1 status' to check status" -ForegroundColor Yellow
    Write-Host "Use '.\start-system.ps1 logs' to view logs" -ForegroundColor Yellow
    Write-Host ""
}

function Stop-Daemon {
    Write-Host ""
    Write-Host "=== Stopping Daemon ===" -ForegroundColor Cyan
    Write-Host ""
    
    npm run daemon:stop
    
    Write-Host ""
    Write-Host "✓ System stopped" -ForegroundColor Green
    Write-Host ""
}

function Restart-Daemon {
    Write-Host ""
    Wdev:daemon' {
        Start-DevDaemon
    }
    'rite-Host "=== Restarting Daemon ===" -ForegroundColor Cyan
    Write-Host ""
    
    npm run daemon:restart
    
    Write-Host ""
    Write-Host "✓ System restarted" -ForegroundColor Green
    Write-Host ""
}

function Show-Status {
    Write-Host ""
    Write-Host "=== System Status ===" -ForegroundColor Cyan
    Write-Host ""
    
    npm run daemon:status
    
    Write-Host ""
}

function Show-Logs {
    Write-Host ""
    Write-Host "=== System Logs ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to exit" -ForegroundColor Yellow
    Write-Host ""
    
    npm run daemon:logs
}

# Main execution
switch ($Command) {
    'install' {
        Install-Dependencies
    }
    'dev' {
        Start-DevMode
    }
    'build' {
        Build-Production
    }
    'start' {
        Start-Daemon
    }
    'stop' {
        Stop-Daemon
    }
    'restart' {
        Restart-Daemon
    }
    'status' {
        Show-Status
    }
    'logs' {
        Show-Logs
    }
    'help' {
        Show-Help
    }
    default {
        Show-Help
    }
}
