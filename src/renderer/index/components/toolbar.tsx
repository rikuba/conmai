import { clipboard, remote } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State, Page } from '../reducers';
import * as selectors from '../selectors';
import * as actions from '../actions';

import './toolbar.css';

type Props = React.Props<any> & StateProps & DispatchProps;

type StateProps = {
  selectedPage: Page;
};

const mapStateToProps = (state: State): StateProps => ({
  selectedPage: selectors.getSelectedPage(state),
});

type DispatchProps = {
  openUrl: (url: string) => Promise<void>;
  openSubWindow: () => Promise<void>;
};

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  openUrl: (url: string) => dispatch(actions.openPage(url)),
  openSubWindow: () => dispatch(actions.openSubWindow()),
});

type OwnState = {
  url: string;
  lastSelectedThread: string;
};

class ToolbarComponent extends React.Component<Props, OwnState> {
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
        this.props.openUrl(text);
      },
    },
    { role: 'delete', label: '削除', visible: false },
    { type: 'separator' },
    { role: 'selectall', label: 'すべて選択' },
  ]);

  private urlInputDeleteMenuItem = this.urlInputContextMenu.items.find(
    (item) => (item as any).role === 'delete',
  )!;

  state = {
    url: this.props.selectedPage && this.props.selectedPage.url,
    lastSelectedThread: this.props.selectedPage && this.props.selectedPage.url,
  };

  componentWillReceiveProps(nextProps: Props) {
    const { selectedPage } = nextProps;
    if (!selectedPage) {
      this.setState({
        url: '',
        lastSelectedThread: '',
      });
    } else if (selectedPage.url !== this.state.lastSelectedThread) {
      this.setState({
        url: selectedPage.url,
        lastSelectedThread: selectedPage.url,
      });
    }
  }

  handleOpenSubwindowButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.openSubWindow();
  };

  handleUrlInputKeydown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape') {
      const { selectedPage } = this.props;
      if (selectedPage) {
        this.setState({
          url: selectedPage.url,
        });
      }
    }
  };

  handleUrlInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({
      url: e.target.value,
    });
  };

  handleUrlInputContextMenu: React.MouseEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    const input = e.currentTarget;
    this.urlInputDeleteMenuItem.visible = input.selectionStart !== input.selectionEnd;
    this.urlInputContextMenu.popup(remote.getCurrentWindow());
  };

  handleUrlSubmit: React.ReactEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const url = this.state.url;
    this.props.openUrl(url);
  };

  render() {
    return (
      <div className="toolbar">
        <button className="open-subwindow-button" onClick={this.handleOpenSubwindowButtonClick}>
          字幕
        </button>
        <form onSubmit={this.handleUrlSubmit} className="url-form">
          <input
            type="text"
            className="url-input"
            placeholder="URLを入力します"
            value={this.state.url}
            onChange={this.handleUrlInputChange}
            onKeyDown={this.handleUrlInputKeydown}
            onContextMenu={this.handleUrlInputContextMenu}
          />
          <button type="submit">開く</button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarComponent);
