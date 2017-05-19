import { app, BrowserWindow, ipcMain, screen } from 'electron';
import loadDevtool from 'electron-load-devtool';
import path from 'path';
import url from 'url';

let window: Electron.BrowserWindow | null = null;
let subWindow: Electron.BrowserWindow | null = null;
let ignoreMouseEvents = false;

function createWindow(): void {
  window = new BrowserWindow({
    width: 600,
    height: 600,
  });

  window.webContents.on('new-window', handleNewWindow);

  window.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'pages', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  window.on('closed', () => {
    window = null;

    if (subWindow !== null) {
      subWindow.close();
    }
  });
}

const handleNewWindow = (e: any, url: string) => {
  e.preventDefault();
  // TODO: process url
};

app.on('ready', () => {
  createWindow();

  if (process.env.NODE_ENV === 'development') {
    loadDevtool(loadDevtool['REACT_DEVELOPER_TOOLS']);
    loadDevtool(loadDevtool['REDUX_DEVTOOLS']);
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

ipcMain.on('open-subwindow-request', (e) => {
  if (subWindow !== null) {
    console.log('received open-subwindow-request but subwindow is already open');
    return;
  }
  subWindow = new BrowserWindow({
    x: 1620,
    y: 80,
    width: 800,
    height: 400,
    transparent: true,
    frame: false,
    resizable: false, // TODO: should be false because break transparency on some platforms
    alwaysOnTop: true,
  });

  subWindow.on('new-window', handleNewWindow);

  subWindow.setIgnoreMouseEvents(ignoreMouseEvents = true);

  subWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'pages', 'sub.html'),
    protocol: 'file:',
    slashes: true,
  }));

  subWindow.on('closed', () => {
    subWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    subWindow.webContents.openDevTools();
  }
});

ipcMain.on('new-posts', (e, newPosts) => {
  if (subWindow) {
    subWindow.webContents.send('new-posts', newPosts);
  }
});

ipcMain.on('set-subwindow-is-ignore-mouse-events', (e, value) => {
  if (subWindow !== null) {
    subWindow.setIgnoreMouseEvents(value);
  }
});
