import { clipboard, ipcRenderer, remote } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State, Thread, getSelectedThread } from '../../reducers';
import { openThread, updateSelectedThread } from '../../actions';

import './toolbar.css';

type Props = StateProps & DispatchProps;

interface StateProps {
  selectedThread: Thread | undefined;
}

interface DispatchProps {
  openThread: (url: string) => Promise<void>;
  updateSelectedThread: () => Promise<void>;
}

const mapStateToProps = (state: State): StateProps => ({
  selectedThread: getSelectedThread(state),
});

const mapDispatchToProps = {
  openThread,
  updateSelectedThread,
};

class ToolbarComponent extends React.Component<Props, { url: string, lastSelectedThread: string }> {
  private urlInputContextMenu = remote.Menu.buildFromTemplate([
    { role: 'undo', label: '元に戻す' },
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
    { role: 'delete', label: '削除', visible: false },
    { type: 'separator' },
    { role: 'selectall', label: 'すべて選択' },
  ]);

  private urlInputDeleteMenuItem = this.urlInputContextMenu.items
    .find((item) => item.role === 'delete')!;

  state = {
    url: '',
    lastSelectedThread: '',
  };

  componentWillReceiveProps(nextProps: Props) {
    const { selectedThread } = nextProps;
    if (!selectedThread) {
      this.setState({
        url: '',
        lastSelectedThread: '',
      });
    } else if (selectedThread.url !== this.state.lastSelectedThread) {
      this.setState({
        url: selectedThread.url,
        lastSelectedThread: selectedThread.url,
      });
    }
  }

  handleUrlInputKeydown = (e: any) => {
    if (e.key === 'Escape') {
      const { selectedThread } = this.props;
      if (selectedThread) {
        this.setState({
          url: selectedThread.url,
        });
      }
    }
  };

  handleUrlInputChange = (e: any) => {
    this.setState({
      url: e.target.value,
    });
  };

  handleUrlInputContextMenu = (e: any) => {
    e.preventDefault();

    const input: HTMLInputElement = e.currentTarget;
    this.urlInputDeleteMenuItem.visible = input.selectionStart !== input.selectionEnd;
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
    const { selectedThread } = this.props;
    const updateButtonDisabled = selectedThread ? selectedThread.isFetching : false;

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
        <button
          disabled={updateButtonDisabled}
          onClick={this.handleUpdateButtonClick}>更新</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);
