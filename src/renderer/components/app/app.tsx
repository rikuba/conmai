import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread, updateThread } from '../../actions';
import { State, Thread, getSelectedThread } from '../../reducers';
import ToolbarComponent from '../toolbar/toolbar';
import ThreadComponent from '../thread/thread';

import './app.css';

type Props = StateProps;

interface StateProps {
  thread: Thread | undefined;
}

const mapStateToProps = (state: State): StateProps => ({
  thread: getSelectedThread(state),
});

class AppComponent extends React.Component<Props, any> {
  handleClickOpenSubWindowButton = (e: any) => {
    ipcRenderer.send('open-subwindow-request');
  };

  render() {
    const { thread } = this.props;

    return (
      <div className="application">
        <ToolbarComponent />
        {
          thread ?
            <ThreadComponent key={thread.url} {...thread} /> :
            <div></div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(AppComponent);
