import { app, BrowserWindow } from 'electron';
import path from 'path';
import url from 'url';

let window: Electron.BrowserWindow | null = null;

function createWindow(): void {
  window = new BrowserWindow({
    width: 800,
    height: 600,
  });

  window.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'pages', 'index', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
});
