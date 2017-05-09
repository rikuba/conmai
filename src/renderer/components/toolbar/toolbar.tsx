import { clipboard, ipcRenderer, remote } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State, Thread, getSelectedThread } from '../../reducers';
import { openThread, updateSelectedThread } from '../../actions';

import './toolbar.css';

type Props = StateProps & DispatchProps;

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

class ToolbarComponent extends React.Component<Props, { url: string }> {
  private urlInputContextMenu = remote.Menu.buildFromTemplate([
    { role: 'undo', label: '取消' },
    { type: 'separator' },
    { role: 'cut', label: '切り取り' },
    { role: 'copy', label: 'コピー' },
    { role: 'paste', label: '貼り付け' },
    {
      label: '貼り付けて移動',
      click: (menuItem, browserWindow, event) => {
        const text = clipboard.readText();
        this.props.openThread(text);
      },
    },
    { type: 'separator' },
    { role: 'selectall', label: 'すべて選択' },
  ]);

  state = {
    url: '',
  };

  setStateFromProps(props: Props) {
    const { selectedThread } = props;
    if (selectedThread) {
      this.setState({
        url: selectedThread.url,
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setStateFromProps(nextProps);
  }

  handleUrlInputKeydown = (e: any) => {
    if (e.key === 'Escape') {
      this.setStateFromProps(this.props);
    }
  };

  handleUrlInputChange = (e: any) => {
    this.setState({
      url: e.target.value,
    });
  };

  handleUrlInputContextMenu = (e: any) => {
    e.preventDefault();
    this.urlInputContextMenu.popup(remote.getCurrentWindow());
  };

  handleUrlSubmit = (e: any) => {
    e.preventDefault();

    const url = this.state.url;
    this.props.openThread(url);
  };

  handleUpdateButtonClick = (e: any) => {
    this.props.updateSelectedThread();
  };

  render() {
    return (
      <div className="toolbar">
        <button onClick={(e) => ipcRenderer.send('open-subwindow-request')}>字幕</button>
        <form onSubmit={this.handleUrlSubmit} className="url-form">
          <input type="text" className="url-input"
            placeholder="URLを入力します"
            value={this.state.url}
            onChange={this.handleUrlInputChange}
            onKeyDown={this.handleUrlInputKeydown}
            onContextMenu={this.handleUrlInputContextMenu} />
          <button type="submit">開く</button>
        </form>
        <button onClick={this.handleUpdateButtonClick}>更新</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);
