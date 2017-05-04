import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread } from '../../actions';
import { State } from '../../reducers';
import ToolbarComponent from '../toolbar/toolbar';
import ThreadComponent, { ThreadProps } from '../thread/thread';

import './app.css';

interface AppProps {
  thread: ThreadProps | null;
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
      <div className="application">
        <ToolbarComponent onUrlEnter={this.handleUrlEnter}></ToolbarComponent>
        {
          thread != null ?
            <ThreadComponent {...thread} /> :
            <div></div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: State): Partial<AppProps> => {
  const thread = state.threads[0] || null;

  return {
    thread,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>): Partial<AppProps> => ({
  openThread: (url: string) => dispatch(openThread(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
