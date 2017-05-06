import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State } from '../../reducers';
import { openThread, updateThread } from '../../actions';

import './toolbar.css';

interface DispatchProps {
  openThread: (url: string) => Promise<void>;
  updateThread: (url: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: Dispatch<State>): DispatchProps => ({
  openThread: (url: string) => dispatch(openThread(url)),
  updateThread: (url: string) => dispatch(updateThread(url)),
});

class ToolbarComponent extends React.Component<DispatchProps, any> {
  private urlInput: HTMLInputElement;

  handleUrlSubmit = (e: any) => {
    e.preventDefault();

    const url = this.urlInput.value;
    this.props.openThread(url);
  };

  handleUpdateButtonClick = (e: any) => {
    const url = this.urlInput.value;
    this.props.updateThread(url);
  };

  render() {
    return (
      <div className="toolbar">
        <button onClick={(e) => ipcRenderer.send('open-subwindow-request')}>字幕</button>
        <form onSubmit={this.handleUrlSubmit} className="url-form">
          <input type="text" className="url-input"
            placeholder="URLを入力します"
            defaultValue="http://jbbs.shitaraba.net/bbs/read.cgi/computer/42660/1462262759/"
            ref={(node) => this.urlInput = node} />
          <button type="submit">開く</button>
        </form>
        <button onClick={this.handleUpdateButtonClick}>更新</button>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(ToolbarComponent);
