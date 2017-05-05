import { ipcRenderer } from 'electron';

import React from 'react';

import './toolbar.css';

interface ToolbarProps {
  onUrlEnter: (url: string) => void;
  requestUpdate: (url: string) => void;
}

export default class ToolbarComponent extends React.Component<ToolbarProps, any> {
  private urlInput: HTMLInputElement;

  handleUrlSubmit = (e) => {
    e.preventDefault();

    const url = this.urlInput.value;
    this.props.onUrlEnter(url);
  };

  handleUpdateButtonClick = (e) => {
    const url = this.urlInput.value;
    this.props.requestUpdate(url);
  };

  render() {
    return (
      <div className="toolbar">
        <button onClick={(e) => ipcRenderer.send('open-subwindow-request')}>字幕</button>
        <form onSubmit={this.handleUrlSubmit} className="url-form">
          <input type="text" className="url-input" placeholder="URLを入力します" ref={(node) => this.urlInput = node} defaultValue="http://jbbs.shitaraba.net/bbs/read.cgi/computer/42660/1462262759/" />
          <button type="submit">開く</button>
        </form>
        <button onClick={this.handleUpdateButtonClick}>更新</button>
      </div>
    );
  }
}
