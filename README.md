# AutoPROMO agent

Headless automation suite for Telegram and Twitter.

## Features
- Auto-DM
- Auto-React
- Auto-Join
- Scraper
- Keyword Listener

## How to Build the Windows Installer (.exe)

I have simplified the build process to a single command.

1.  **Export the Project:**
    -   Go to the **Settings** menu in AI Studio.
    -   Select **Export to ZIP**.
    -   Extract the ZIP file on your local machine.

2.  **One-Click Build:**
    -   Open a terminal (PowerShell or Command Prompt) in the project folder.
    -   Run: `npm run build:all`
    -   This will automatically:
        -   Install all dependencies.
        -   Rebuild native modules (like SQLite) for Windows.
        -   Compile the backend and frontend.
        -   Generate the installer.

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
