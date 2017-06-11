import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State, Thread, Posts } from '../reducers';
import * as actions from '../actions/thread';
import * as selectors from '../selectors';
import PostsComponent from './posts';
import { generatePostId } from '../../../utils';

import './thread.css';

type Props = React.Props<any> & OwnProps & StateProps & DispatchProps;

interface OwnProps {
  newPostNumber: Thread['newPostNumber'];
  threadUrl: string;
}

interface StateProps {
  posts: Posts;
}

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  posts: selectors.getPosts(state, ownProps.threadUrl),
});

interface DispatchProps {
  loadThread: (url: string) => Promise<void>;
}

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadThread: async (url: string) => {
    await dispatch(actions.fetchBoardSettings(url))
    await dispatch(actions.fetchThread(url));
  },
});

class ThreadComponent extends React.PureComponent<Props, {}> {
  private isScrolledToTheEnd = true;

  private contextMenu = remote.Menu.buildFromTemplate([
    { role: 'copy', label: 'コピー' },
    { role: 'selectall', label: 'すべて選択' },
    { type: 'separator' },
    {
      label: 'スレッドの先頭へ',
      click: (menuItem, browserWindow, event) => {
        this.scrollToTheTop();
      },
    },{
      label: 'スレッドの末尾へ',
      click: (menuItem, browserWindow, event) => {
        this.scrollToTheEnd();
      },
    },
  ]);

  componentDidMount() {
    const { threadUrl, posts, loadThread } = this.props;

    if (posts.length === 0) {
      loadThread(threadUrl);
    }
  }

  componentWillUpdate() {
    const elm = ReactDOM.findDOMNode(this);
    this.isScrolledToTheEnd = elm.scrollTop >= elm.scrollHeight - elm.clientHeight - 10;
  }

  componentDidUpdate() {
    const { newPostNumber } = this.props;
    if (newPostNumber &&
      (newPostNumber === 1 || (newPostNumber > 1 && this.isScrolledToTheEnd))
    ) {
      this.scrollToTheEnd();
    }
  }

  scrollToTheTop() {
    const elm = ReactDOM.findDOMNode(this);
    elm.scrollTop = 0;
  }

  scrollToTheEnd() {
    const elm = ReactDOM.findDOMNode(this);
    elm.scrollTop = elm.scrollHeight - elm.clientHeight;
  }

  scrollToPost(number: number) {
    const doc = ReactDOM.findDOMNode(this).ownerDocument;
    const id = generatePostId(this.props.threadUrl, number);
    doc.getElementById(id)!.scrollIntoView();
  }

  handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    this.contextMenu.popup(remote.getCurrentWindow());
  };

  handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;

    if (target.matches('a')) {
      e.preventDefault();
      const [, number] = /^>>(\d+)$/.exec(target.textContent!)!;
      this.scrollToPost(parseInt(number, 10));
    }
  };

  render() {
    const { posts, newPostNumber, threadUrl } = this.props;

    return (
      <div className="thread"
        onContextMenu={this.handleContextMenu}
        onClick={this.handleClick}>
        <PostsComponent posts={posts} newPostNumber={newPostNumber} threadUrl={threadUrl} />
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ThreadComponent);
