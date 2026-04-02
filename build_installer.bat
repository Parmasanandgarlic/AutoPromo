@echo off
setlocal
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
echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Rebuilding native modules for Windows...
call npx electron-rebuild

echo.
echo [3/4] Compiling Backend and Frontend...
call npm run build
call npm run build:server
call npm run build:electron

echo.
echo [4/4] Generating Windows Installer (.exe)...
call npx electron-builder --win --x64

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
