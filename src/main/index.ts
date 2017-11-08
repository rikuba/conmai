import { app, BrowserWindow, ipcMain } from 'electron';
import loadDevtool from 'electron-load-devtool';
import path from 'path';
import url from 'url';
import fs from 'fs';

import { configureStore } from '../renderer/index/store';
import * as actions from '../renderer/index/actions';

const userDataPath = app.getPath('userData');
const sessionFilePath = path.join(userDataPath, 'session.json');

let window: Electron.BrowserWindow | null = null;
let subWindow: Electron.BrowserWindow | null = null;

let preloadedState: any;
try {
  const text = fs.readFileSync(sessionFilePath, 'utf8');
  preloadedState = JSON.parse(text);
} catch (e) {}

const store = configureStore(preloadedState);

function createWindow(): void {
  const { x, y, width, height } = store.getState().preferences.mainWindowBounds;
  const bounds = x < 0 ?
    { center: true, width, height } :
    { x, y, width, height };

  window = new BrowserWindow(bounds);

  window.webContents.on('new-window', handleNewWindow);

  window.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'renderer', 'index', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  window.on('close', () => {
    store.dispatch(actions.mainWindowClosed(window!.getBounds()));

    const state = store.getState();
    fs.writeFileSync(
      sessionFilePath,
      JSON.stringify(state, null, 2),
      { encoding: 'utf8' },
    );
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

  if (store.getState().ui.subWindowIsOpen) {
    ipcMain.emit('open-sub-window');
  }

  if (process.env.NODE_ENV === 'development') {
    loadDevtool(loadDevtool['REACT_DEVELOPER_TOOLS']);
    loadDevtool(loadDevtool['REDUX_DEVTOOLS']);
    window!.webContents.openDevTools({ mode: 'detach' });
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

  const { x, y, width, height } = store.getState().preferences.subWindowBounds;
  const bounds = x < 0 ?
    { center: true, width, height } :
    { x, y, width, height };

  subWindow = new BrowserWindow({
    ...bounds,
    transparent: true,
    frame: false,
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
    subWindow.webContents.openDevTools({ mode: 'detach' });
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
