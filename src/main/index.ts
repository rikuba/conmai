import { app, BrowserWindow, ipcMain } from 'electron';
import loadDevtool from 'electron-load-devtool';
import path from 'path';
import url from 'url';

import { configureStore } from '../renderer/index/store';
import * as actions from '../renderer/index/actions';

let window: Electron.BrowserWindow | null = null;
let subWindow: Electron.BrowserWindow | null = null;

const store = configureStore();

function createWindow(): void {
  window = new BrowserWindow({
    width: 600,
    height: 600,
  });

  window.webContents.on('new-window', handleNewWindow);

  window.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'index', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  window.on('close', () => {
    store.dispatch(actions.mainWindowClosed(window!.getBounds()));
  });

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

ipcMain.on('open-sub-window', (e: any) => {
  if (subWindow !== null) {
    subWindow.focus();
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

  subWindow.webContents.on('new-window', handleNewWindow);

  subWindow.setIgnoreMouseEvents(true);

  subWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'sub', 'sub.html'),
    protocol: 'file:',
    slashes: true,
  }));

  subWindow.on('close', () => {
    store.dispatch(actions.subWindowClosed(subWindow!.getBounds()));
  });

  subWindow.on('closed', () => {
    subWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    subWindow.webContents.openDevTools();
  }
});

ipcMain.on('new-posts', (e: any, newPosts: any) => {
  if (subWindow) {
    subWindow.webContents.send('new-posts', newPosts);
  }
});

ipcMain.on('set-subwindow-is-ignore-mouse-events', (e: any, value: boolean) => {
  if (subWindow !== null) {
    subWindow.setIgnoreMouseEvents(value);
  }
});
