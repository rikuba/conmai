import React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { State, Page } from '../reducers';
import * as selectors from '../selectors';
import ToolbarComponent from './toolbar';
import TabbarComponent from './tabbar';
import TabPanelsComponent from './tabpanels';
import TabPanelComponent from './tabpanel';
import PageComponent from './page';
import ShitarabaThread from './shitaraba/thread';

import './app.css';

type Props = React.Props<any> & StateProps & DispatchProp<State>;

type StateProps = {
  allPages: Page[];
  selectedPageId: Page['id'];
};

const mapStateToProps = (state: State): StateProps => ({
  allPages: selectors.getAllPages(state),
  selectedPageId: selectors.getSelectedPageId(state),
});

class AppComponent extends React.PureComponent<Props, {}> {
  render() {
    const { allPages, selectedPageId } = this.props;
    const tabpanels = allPages.map((page) => (
      <TabPanelComponent key={page.id} isSelected={page.id === selectedPageId}>
        {this.determinePageComponent(page)}
      </TabPanelComponent>
    ));

    return (
      <div className="application">
        <ToolbarComponent />
        <TabbarComponent />
        <TabPanelsComponent>{tabpanels}</TabPanelsComponent>
      </div>
    );
  }

  determinePageComponent(page: Page): React.ReactNode {
    switch (page.pageType) {
      case 'shitaraba':
        return <ShitarabaThread id={page.id} url={page.url} />;

      case 'cavetube':
        return <PageComponent id={page.id} url={page.url} preload="../../scripts/cavetube.js" />;

      case 'twitch':
        return <PageComponent id={page.id} url={page.url} preload="../../scripts/twitch.js" />;

      default:
        return <PageComponent id={page.id} url={page.url} />;
    }
  }
}

export default connect(mapStateToProps)(AppComponent);
