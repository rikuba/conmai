import React from 'react';

import './statusbar.css';

interface Props {
  isFething: boolean;
  interval: number;
  wait: number;
}

export default class StatusbarComponent extends React.Component<Props, {}> {
  render() {
    const { isFething, interval, wait } = this.props;
    const remain = interval - wait;
    let remainView: React.ReactChild | React.ReactChild[] = remain;
    if (interval >= 10 && remain < 10) {
      remainView = [<span style={{ color: 'transparent' }}>0</span>, remain];
    }

    return (
      <div className="statusbar">
        <p className="status-text">{isFething ? '更新中' : '自動更新'} [{remainView}/{interval}]</p>
      </div>
    );
  }
}
