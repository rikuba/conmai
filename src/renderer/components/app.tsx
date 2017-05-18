import { ipcRenderer } from 'electron';
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { openThread, updateThread } from '../actions';
import { State, Thread, getAllThreads, getSelectedThread } from '../reducers';
import ToolbarComponent from './toolbar';
import TabbarComponent from './tabbar';
import ThreadComponent from './thread';
import StatusbarComponent from './statusbar';

import './app.css';

type Props = StateProps;

interface StateProps {
  allThreads: Thread[];
  selectedThread: Thread | undefined;
}

const mapStateToProps = (state: State): StateProps => ({
  allThreads: getAllThreads(state),
  selectedThread: getSelectedThread(state),
});

class AppComponent extends React.PureComponent<Props, any> {
  handleClickOpenSubWindowButton = (e: any) => {
    ipcRenderer.send('open-subwindow-request');
  };

  render() {
    const { allThreads, selectedThread } = this.props;
    const threadsView = allThreads.map((thread) => (
      <ThreadComponent key={thread.url}
        isSelected={thread === selectedThread}
        newPostNumber={thread.newPostNumber}
        posts={thread.posts} />
    ));
    if (threadsView.length === 0) {
      threadsView.push(<div className="thread" key=""></div>);
    }

    return (
      <div className="application">
        <ToolbarComponent />
        <TabbarComponent />
        <div className="thread-container">
          {threadsView}
        </div>
        <StatusbarComponent />
      </div>
    );
  }
}

export default connect(mapStateToProps)(AppComponent);
