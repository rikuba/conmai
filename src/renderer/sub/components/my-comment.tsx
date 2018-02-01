import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';

import debounce from 'lodash.debounce';

type OwnState = {
  text: string;
};

export default class MyComment extends React.Component<{}, OwnState> {
  state = {
    text: localStorage.getItem('my-comment') || '',
  };

  handleInput = debounce(() => {
    const elm = ReactDOM.findDOMNode(this);
    const text = elm.textContent!;
    localStorage.setItem('my-comment', text);
  }, 1000);

  private contextMenu = remote.Menu.buildFromTemplate([
    { role: 'undo', label: '元に戻す' },
    { type: 'separator' },
    { role: 'cut', label: '切り取り' },
    { role: 'copy', label: 'コピー' },
    { role: 'paste', label: '貼り付け' },
    { role: 'delete', label: '削除' },
    { type: 'separator' },
    { role: 'selectall', label: 'すべて選択' },
  ]);

  handleContextMenu: React.MouseEventHandler<HTMLParagraphElement> = (e) => {
    e.preventDefault();

    this.contextMenu.popup();
  };

  render() {
    const { text } = this.state;

    return (
      <p
        className="sub my-comment"
        contentEditable
        onInput={this.handleInput}
        onContextMenu={this.handleContextMenu}>
        {text}
      </p>
    );
  }
}
