import React from 'react';
import { connect } from 'react-redux';

import { State, Thread } from '../reducers';
import * as selectors from '../selectors';
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
  allThreads: selectors.getAllThreads(state),
  selectedThread: selectors.getSelectedThread(state),
});

class AppComponent extends React.PureComponent<Props, any> {
  render() {
    const { allThreads, selectedThread } = this.props;
    const threadsView = allThreads.map((thread) => (
      <ThreadComponent key={thread.url}
        threadUrl={thread.url}
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
