import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread, updateThread } from '../../actions';
import { State, Thread } from '../../reducers';
import ToolbarComponent from '../toolbar/toolbar';
import ThreadComponent from '../thread/thread';

import './app.css';

interface AppProps {
  threads: Thread[];
  openThread: (url: string) => void;
  updateThread: (url: string) => void;
}

const mapStateToProps = (state: State): Partial<AppProps> => {
  const { threads } = state;

  return {
    threads,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<State>): Partial<AppProps> => ({
  openThread: (url: string) => void dispatch(openThread(url)),
  updateThread: (url: string) => void dispatch(updateThread(url)),
});

class AppComponent extends React.Component<AppProps, any> {
  handleClickOpenSubWindowButton = (e) => {
    ipcRenderer.send('open-subwindow-request');
  };

  handleUrlEnter = (url: string) => {
    this.props.openThread(url);
  };

  requestUpdate = (url: string) => {
    this.props.updateThread(url);
  };

  render() {
    const { threads } = this.props;
    const thread = threads[0];

    return (
      <div className="application">
        <ToolbarComponent
          onUrlEnter={this.handleUrlEnter}
          requestUpdate={this.requestUpdate}>
        </ToolbarComponent>
        {
          thread ?
            <ThreadComponent {...thread} /> :
            <div></div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
