import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread, updateThread } from '../../actions';
import { State, Thread, getSelectedThread, getUpdateIntervalPreference } from '../../reducers';
import ToolbarComponent from '../toolbar/toolbar';
import ThreadComponent from '../thread/thread';
import StatusbarComponent from '../statusbar/statusbar';

import './app.css';

type Props = StateProps;

interface StateProps {
  thread: Thread | undefined;
  interval: number;
}

const mapStateToProps = (state: State): StateProps => ({
  thread: getSelectedThread(state),
  interval: getUpdateIntervalPreference(state),
});

class AppComponent extends React.Component<Props, any> {
  handleClickOpenSubWindowButton = (e: any) => {
    ipcRenderer.send('open-subwindow-request');
  };

  render() {
    const { thread, interval } = this.props;
    const wait = thread ? thread.updateWait : 0;
    const isFething = thread ? thread.isFetching : false;

    return (
      <div className="application">
        <ToolbarComponent />
        {thread ?
          <ThreadComponent key={thread.url} {...thread} /> :
          <div></div>}
        <StatusbarComponent {...{ isFething, interval, wait }} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AppComponent);
