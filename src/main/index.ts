import { app, BrowserWindow } from 'electron';
import loadDevtool from 'electron-load-devtool';
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

  if (process.env.NODE_ENV === 'development') {
    loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
    loadDevtool(loadDevtool.REDUX_DEVTOOLS);
    window!.webContents.openDevTools();
  }
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
