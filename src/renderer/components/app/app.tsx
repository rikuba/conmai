import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread, updateThread } from '../../actions';
import { State, Thread } from '../../reducers';
import ToolbarComponent from '../toolbar/toolbar';
import ThreadComponent from '../thread/thread';

import './app.css';

type Props = StateProps;

interface StateProps {
  threads: Thread[];
}

const mapStateToProps = (state: State): StateProps => {
  const { threads } = state;

  return {
    threads,
  };
};

class AppComponent extends React.Component<Props, any> {
  handleClickOpenSubWindowButton = (e: any) => {
    ipcRenderer.send('open-subwindow-request');
  };

  render() {
    const { threads } = this.props;
    const thread = threads[0];

    return (
      <div className="application">
        <ToolbarComponent />
        {
          thread ?
            <ThreadComponent {...thread} /> :
            <div></div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(AppComponent);
