import { ipcRenderer } from 'electron';
import React from 'react';
import css from './app.css';

export default class App extends React.Component<{}, {}> {
  handleClickOpenSubWindowButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    ipcRenderer.send('open-subwindow-request');
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClickOpenSubWindowButton}>Open sub window</button>
      </div>
    );
  }
}
