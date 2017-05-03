import { ipcRenderer } from 'electron';

import React, { MouseEventHandler } from 'react';

import './toolbar.css';

interface ToolbarProps {
  onUrlEnter: (url: string) => void;
}

export default class ToolbarComponent extends React.Component<ToolbarProps, any> {
  private urlInput: HTMLInputElement;

  handleOpenButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const url = this.urlInput.value;
    this.props.onUrlEnter(url);
  };

  render() {
    return (
      <div className="toolbar">
        <button onClick={(e) => ipcRenderer.send('open-subwindow-request')}>字幕</button>
        <input type="text" className="url-input" ref={(node) => this.urlInput = node} />
        <button onClick={this.handleOpenButtonClick}>開く</button>
        <button>更新</button>
      </div>
    );
  }
}
