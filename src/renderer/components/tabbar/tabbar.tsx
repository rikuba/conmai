import React from 'react';
import { connect } from 'react-redux';

import { State, Thread, getAllThreads, getSelectedThread } from '../../reducers';
import { selectThread, closeThread } from '../../actions';

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
};

class TabbarComponent extends React.Component<Props, {}> {
  render() {
    const tabs = this.props.allThreads.map((thread) => (
      <TabComponent key={thread.url} {...thread}
        isSelected={thread === this.props.selectedThread}
        onTabSelect={this.props.selectThread}
        onTabClose={this.props.closeThread} />
    ));

    return (
      <div className="tabbar">
        {tabs}
      </div>
    );
  }
}

class TabComponent extends React.Component<Thread & {
  isSelected: boolean;
  onTabSelect: (url: string) => void;
  onTabClose: (url: string) => void;
}, {}> {
  handleTabClick = (e: any) => {
    const { url } = this.props;

    if (e.target.matches('.tab-close-button, .tab-close-button *')) {
      this.props.onTabClose(url);
      return;
    }

    this.props.onTabSelect(url);
  };

  render() {
    return (
      <div className="tab" aria-selected={this.props.isSelected} onClick={this.handleTabClick}>
        <span className="tab-label">{this.props.title}</span>
        <span className="tab-close-button">×</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabbarComponent);
