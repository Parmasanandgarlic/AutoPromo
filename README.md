# AutoPROMO agent

Headless automation suite for Telegram and Twitter.

## Features
- Auto-DM
- Auto-React
- Auto-Join
- Scraper
- Keyword Listener

## How to Build the Windows Installer (.exe)

I have created a **"One-Click"** builder script for Windows.

1.  **Export the Project:**
    -   Go to the **Settings** menu in AI Studio.
    -   Select **Export to ZIP**.
    -   Extract the ZIP file on your local machine.

2.  **One-Click Build:**
    -   Find the file named **`build_installer.bat`** in the project folder.
    -   **Double-click it.**
    -   The script will automatically install everything, rebuild the database engine for Windows, and generate your installer.

3.  **Find Your Files:**
    -   Check the `release` folder. You will find:
        -   `AutoPROMO agent Setup.exe`: A standard installer.
        -   `AutoPROMO agent.exe`: A **Portable** version (no installation required, just run it).

## Development Mode

To run the application in development mode with Electron:
- Run: `npm run electron:dev`

## PWA Installation

You can also install this application directly from your browser as a Progressive Web App (PWA):
- Open the application in Chrome or Edge.
- Click the "Install App" button in the **App Settings** tab or the browser's address bar.
