const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: "Froggy's Pies",
    icon: path.join(__dirname, '../public/icon.png')
  });

  // In development, load from the local dev server
  // In production, load from the built files
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window errors
  mainWindow.webContents.on('did-fail-load', () => {
    console.log('Failed to load application');
    if (isDev) {
      console.log('Make sure your development server is running on port 3000');
      // Retry loading after a short delay
      setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
      }, 3000);
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});