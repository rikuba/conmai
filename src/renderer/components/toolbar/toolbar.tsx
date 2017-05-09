import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State, Thread, getSelectedThread } from '../../reducers';
import { openThread, updateSelectedThread } from '../../actions';

import './toolbar.css';

interface StateProps {
  selectedThread: Thread;
}

interface DispatchProps {
  openThread: (url: string) => Promise<void>;
  updateSelectedThread: () => Promise<void>;
}

const mapStateToProps = (state: State) => ({
  selectedThread: getSelectedThread(state),
});

const mapDispatchToProps = (dispatch: Dispatch<State>): DispatchProps => ({
  openThread: (url: string) => dispatch(openThread(url)),
  updateSelectedThread: () => dispatch(updateSelectedThread()),
});

class ToolbarComponent extends React.Component<StateProps & DispatchProps, any> {
  private urlInput: HTMLInputElement;

  handleUrlInputKeydown = (e: any) => {
    if (e.key === 'Escape') {
      const { selectedThread } = this.props;
      if (selectedThread) {
        this.urlInput.value = selectedThread.url;
      }
    }
  };

  handleUrlSubmit = (e: any) => {
    e.preventDefault();

    const url = this.urlInput.value;
    this.props.openThread(url);
  };

  handleUpdateButtonClick = (e: any) => {
    this.props.updateSelectedThread();
  };

  render() {
    const { selectedThread } = this.props;
    const url = selectedThread ? selectedThread.url : '';

    return (
      <div className="toolbar">
        <button onClick={(e) => ipcRenderer.send('open-subwindow-request')}>字幕</button>
        <form onSubmit={this.handleUrlSubmit} className="url-form">
          <input type="text" className="url-input"
            placeholder="URLを入力します"
            defaultValue={url}
            onKeyDown={this.handleUrlInputKeydown}
            ref={(node) => this.urlInput = node} />
          <button type="submit">開く</button>
        </form>
        <button onClick={this.handleUpdateButtonClick}>更新</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);
