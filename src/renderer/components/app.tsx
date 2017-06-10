import React from 'react';
import { connect } from 'react-redux';

import { State, Thread } from '../../store/reducers';
import * as selectors from '../../store/selectors';
import ToolbarComponent from './toolbar';
import TabbarComponent from './tabbar';
import TabPanelsComponent from './tabpanels';
import TabPanelComponent from './tabpanel';
import ThreadComponent from './thread';

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
    const tabpanels = allThreads.map((thread) => (
      <TabPanelComponent key={thread.url}
        isSelected={thread === selectedThread}>
        <ThreadComponent
          threadUrl={thread.url}
          newPostNumber={thread.newPostNumber} />
      </TabPanelComponent>
    ));

    return (
      <div className="application">
        <ToolbarComponent />
        <TabbarComponent />
        <TabPanelsComponent>
          {tabpanels}
        </TabPanelsComponent>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AppComponent);
