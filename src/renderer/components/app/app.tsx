import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread } from '../../actions';
import { State } from '../../reducers';
import ToolbarComponent from '../toolbar/toolbar';
import ThreadComponent, { ThreadProps } from '../thread/thread';

import css from './app.css';

interface AppProps {
  thread: ThreadProps;
  openThread: (url: string) => void;
}

class AppComponent extends React.Component<AppProps, any> {
  handleClickOpenSubWindowButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    ipcRenderer.send('open-subwindow-request');
  };

  handleUrlEnter = (url: string) => {
    this.props.openThread(url);
  };

  render() {
    const { thread } = this.props;
    return (
      <div className={css.application}>
        <ToolbarComponent onUrlEnter={this.handleUrlEnter}></ToolbarComponent>
        <ThreadComponent {...thread} />
      </div>
    );
  }
}

const mapStateToProps = (state: State): Partial<AppProps> => {
  const {
    title = '',
    posts = [],
  } = state.threads[0] || {};

  return {
    thread: {
      title,
      posts,
    }
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>): Partial<AppProps> => ({
  openThread: (url: string) => dispatch(openThread(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
