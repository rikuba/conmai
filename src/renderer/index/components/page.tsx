import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { State } from '../reducers';
import * as actions from '../actions';

import './page.css';


type Props = React.Props<any> & OwnProps & DispatchProps;

type OwnProps = {
  id: string;
  url: string;
};

type DispatchProps = {
  onGetTitle: (title: string) => void;
  onUpdateFavicon: (faviconUrl: string) => void;
};

const mapDispatchToProps = (dispatch: Dispatch<State>, { id }: OwnProps): DispatchProps => ({
  onGetTitle: (title) => {
    dispatch(actions.pageTitleUpdated(id, title));
  },
  onUpdateFavicon: (faviconUrl) => {
    dispatch(actions.pageFaviconUpdated(id, faviconUrl));
  },
});

export default connect<{}, DispatchProps, {}>(null, mapDispatchToProps)(
class PageComponent extends React.Component<Props, {}> {
  private webview: Electron.WebviewTag | null = null;

  render() {
    const { url } = this.props;

    return (
      <div className="page-container">
        <webview className="page-view" src={url} />
      </div>
    );
  }

  componentDidMount() {
    this.webview = ReactDOM.findDOMNode(this).querySelector('webview') as Electron.WebviewTag;
    this.webview.addEventListener('dom-ready', this.handleDOMReady);
    this.webview.addEventListener('page-favicon-updated', this.handleFaviconUpdated);
  }

  componentWillUnmount() {
    if (this.webview) {
      this.webview.addEventListener('dom-ready', this.handleDOMReady);
      this.webview.addEventListener('page-favicon-updated', this.handleFaviconUpdated);
    }
  }

  handleDOMReady = (e: Electron.Event) => {
    const { onGetTitle } = this.props;

    const title = this.webview!.getTitle();
    onGetTitle(title);
  };

  handleFaviconUpdated = (e: Electron.PageFaviconUpdatedEvent) => {  
    const { onUpdateFavicon } = this.props;

    const faviconUrl = e.favicons[0];
    onUpdateFavicon(faviconUrl);
  };
});
