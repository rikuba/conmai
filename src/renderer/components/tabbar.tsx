import React from 'react';
import { connect } from 'react-redux';

import { State, Thread, getAllThreads, getSelectedThread } from '../reducers';
import { selectThread, closeThread, closeAllOtherThreads } from '../actions';
import TabComponent from './tab';

import './tabbar.css';

type Props = StateProps & typeof mapDispatchToProps;

interface StateProps {
  allThreads: Thread[];
  selectedThread: Thread | undefined;
}

const mapStateToProps = (state: State): StateProps => ({
  allThreads: getAllThreads(state),
  selectedThread: getSelectedThread(state),
});

const mapDispatchToProps = {
  selectThread,
  closeThread,
  closeAllOtherThreads,
};

class TabbarComponent extends React.PureComponent<Props, {}> {
  render() {
    const tabs = this.props.allThreads.map((thread) => (
      <TabComponent key={thread.url}
        url={thread.url}
        icon={thread.icon}
        title={thread.title}
        isSelected={thread === this.props.selectedThread}
        onTabSelect={this.props.selectThread}
        onTabClose={this.props.closeThread}
        onTabCloseOthers={this.props.closeAllOtherThreads} />
    ));

    return (
      <div role="tablist" className="tabbar">
        {tabs}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabbarComponent);
