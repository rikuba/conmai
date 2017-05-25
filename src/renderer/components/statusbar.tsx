import React from 'react';
import { connect } from 'react-redux';

import { State } from '../../reducers';
import * as selectors from '../../selectors';

import './statusbar.css';

type Props = StateProps;

interface StateProps {
  isFething: boolean;
  interval: number;
  wait: number;
}

const mapStateToProps = (state: State): StateProps => {
  const thread = selectors.getSelectedThread(state);
  const interval = selectors.getUpdateIntervalPreference(state);
  const isFething = thread ? thread.isFetching : false;
  const wait = thread ? thread.updateWait : 0;

  return {
    isFething,
    interval,
    wait,
  };
};

class StatusbarComponent extends React.PureComponent<Props, {}> {
  render() {
    const { isFething, interval, wait } = this.props;
    const remain = interval - wait;
    let remainView: React.ReactChild = remain;
    if (interval >= 10 && remain < 10) {
      remainView = <span><span style={{ color: 'transparent' }}>0</span>{remain}</span>;
    }

    return (
      <div className="statusbar">
        <p className="status-text">{isFething ? '更新中' : '自動更新'} [{remainView}/{interval}]</p>
      </div>
    );
  }
}

export default connect<StateProps, {}, {}>(mapStateToProps)(StatusbarComponent);
