import React from 'react';
import { connect } from 'react-redux';

import { State, Page } from '../reducers';
import * as selectors from '../selectors';
import * as actions from '../actions';
import TabComponent from './tab';

import './tabbar.css';

type Props = React.Props<any> & StateProps & DispatchProps;

type StateProps = {
  allPages: Page[];
  selectedPageId: Page['id'];
};

const mapStateToProps = (state: State): StateProps => ({
  allPages: selectors.getAllPages(state),
  selectedPageId: selectors.getSelectedPageId(state),
});

type DispatchProps = typeof actions;

class TabbarComponent extends React.PureComponent<Props, {}> {
  render() {
    const tabs = this.props.allPages.map((page) => (
      <TabComponent key={page.id}
        id={page.id}
        url={page.url}
        icon={page.faviconUrl}
        title={page.title}
        isSelected={page.id === this.props.selectedPageId}
        onTabSelect={this.props.selectPage}
        onTabClose={this.props.closePage}
        onTabCloseOthers={() => {}} />
    ));

    return (
      <div role="tablist" className="tabbar">
        {tabs}
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, actions as any)(TabbarComponent);
