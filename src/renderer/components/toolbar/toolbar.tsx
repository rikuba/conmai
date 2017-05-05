import { ipcRenderer } from 'electron';

import React, { MouseEventHandler } from 'react';

import './toolbar.css';

interface ToolbarProps {
  onUrlEnter: (url: string) => void;
  requestUpdate: (url: string) => void;
}

export default class ToolbarComponent extends React.Component<ToolbarProps, any> {
  private urlInput: HTMLInputElement;

  handleOpenButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const url = this.urlInput.value;
    this.props.onUrlEnter(url);
  };

  handleUpdateButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const url = this.urlInput.value;
    this.props.requestUpdate(url);
  };

  render() {
    return (
      <div className="toolbar">
        <button onClick={(e) => ipcRenderer.send('open-subwindow-request')}>字幕</button>
        <input type="text" className="url-input" ref={(node) => this.urlInput = node} defaultValue="http://jbbs.shitaraba.net/bbs/read.cgi/computer/42660/1462262759/" />
        <button onClick={this.handleOpenButtonClick}>開く</button>
        <button onClick={this.handleUpdateButtonClick}>更新</button>
      </div>
    );
  }
}
