@echo off
setlocal
set npm_config_build_from_source=false
echo ============================================================
echo   AutoPROMO Agent - Windows Installer Builder
echo ============================================================
echo.
echo This script will automatically turn your code into a 
echo Windows Installer (.exe) and a Portable (.exe).
echo.
echo PREREQUISITE: You must have Node.js installed.
echo (https://nodejs.org)
echo.
pause

echo.
echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Compiling Backend and Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Frontend build failed.
    pause
    exit /b %errorlevel%
)
call npm run build:server
call npm run build:electron

echo.
echo [3/3] Generating Windows Installer (.exe)...
call npx electron-builder --win --x64
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Electron build failed. Check the errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo ============================================================
echo   BUILD COMPLETE!
echo ============================================================
echo.
echo Your files are in the "release" folder:
echo 1. AutoPROMO agent Setup.exe (Standard Installer)
echo 2. AutoPROMO agent.exe (Portable - No Install Required)
echo.
pause
