import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';

import PostsComponent from '../posts/posts';
import { Thread } from '../../reducers';

import './thread.css';

type Props = OwnProps;

interface OwnProps {
  newPostNumber: Thread['newPostNumber'];
  posts: Thread['posts'];
  isSelected: boolean;
}

export default class ThreadComponent extends React.PureComponent<Props, any> {
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

  handleContextMenu = (e: any) => {
    e.preventDefault();

    this.contextMenu.popup(remote.getCurrentWindow());
  };

  render() {
    const { posts, newPostNumber, isSelected } = this.props;

    return (
      <div role="tabpanel" className="thread" aria-hidden={String(!isSelected)}
        onContextMenu={this.handleContextMenu}>
        <PostsComponent posts={posts} newPostNumber={newPostNumber} />
      </div>
    );
  }
}
