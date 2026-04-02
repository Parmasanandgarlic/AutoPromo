# AutoPROMO agent

Headless automation suite for Telegram and Twitter.

## Features
- Auto-DM
- Auto-React
- Auto-Join
- Scraper
- Keyword Listener

## How to Build the Windows Installer (.exe)

Since this environment is sandboxed, you need to build the `.exe` on your local Windows machine.

1.  **Export the Project:**
    -   Go to the **Settings** menu in AI Studio.
    -   Select **Export to ZIP**.
    -   Extract the ZIP file on your local machine.

2.  **Install Dependencies:**
    -   Open a terminal (PowerShell or Command Prompt) in the project folder.
    -   Run: `npm install`

3.  **Build the Installer:**
    -   Run: `npm run electron:build`
    -   This will create a `release` folder containing the `AutoPROMO agent Setup.exe` installer.

4.  **Install and Run:**
    -   Run the generated `.exe` to install the application on your Windows 10 or 11 machine.

## Development Mode

To run the application in development mode with Electron:
- Run: `npm run electron:dev`

## PWA Installation

You can also install this application directly from your browser as a Progressive Web App (PWA):
- Open the application in Chrome or Edge.
- Click the "Install App" button in the **App Settings** tab or the browser's address bar.
