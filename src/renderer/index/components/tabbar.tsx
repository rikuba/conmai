import React from 'react';
import { connect } from 'react-redux';

import { State, Thread } from '../reducers';
import * as selectors from '../selectors';
import * as actions from '../actions';
import TabComponent from './tab';

import './tabbar.css';

type Props = React.Props<any> & StateProps & DispatchProps;

type StateProps = {
  allThreads: Thread[];
  selectedThread: Thread | undefined;
};

const mapStateToProps = (state: State): StateProps => ({
  allThreads: selectors.getAllThreads(state),
  selectedThread: selectors.getSelectedThread(state),
});

type DispatchProps = typeof actions;

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

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, actions as any)(TabbarComponent);
