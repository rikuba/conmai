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

class TabbarComponent extends React.PureComponent<Props, {}> {
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

class TabComponent extends React.PureComponent<Thread & {
  isSelected: boolean;
  onTabSelect: (url: string) => void;
  onTabClose: (url: string) => void;
}, {}> {
  private middleButtonPressed = false;

  handleTabClick = (e: any) => {
    const { url } = this.props;

    if (e.target.matches('.tab-close-button, .tab-close-button *')) {
      this.props.onTabClose(url);
      return;
    }

    this.props.onTabSelect(url);
  };

  handleMouseDown = (e: any) => {
    if (e.button === 1) {
      this.middleButtonPressed = true;
    }
  };

  handleMouseOut = (e: any) => {
    this.middleButtonPressed = false;
  };

  handleMouseUp = (e: any) => {
    if (e.button === 1 && this.middleButtonPressed) {
      this.props.onTabClose(this.props.url);
      this.middleButtonPressed = false;
    }
  };

  render() {
    const iconNode = this.props.icon ?
      <img className="tab-icon" src={this.props.icon} /> :
      <span className="tab-icon empty-icon"></span>;

    return (
      <div className="tab" aria-selected={this.props.isSelected}
        title={this.props.title}
        onClick={this.handleTabClick}
        onMouseDown={this.handleMouseDown}
        onMouseOut={this.handleMouseOut}
        onMouseUp={this.handleMouseUp}>
        {iconNode}
        <span className="tab-label">{this.props.title}</span>
        <span className="tab-close-button">×</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabbarComponent);
