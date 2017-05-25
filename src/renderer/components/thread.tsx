import { remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';

import { Thread } from '../../store/reducers';
import PostsComponent from './posts';
import { generatePostId } from '../../utils';

import './thread.css';

type Props = OwnProps;

interface OwnProps {
  newPostNumber: Thread['newPostNumber'];
  posts: Thread['posts'];
  isSelected: boolean;
  threadUrl: string;
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
    const { posts, newPostNumber, isSelected, threadUrl } = this.props;

    return (
      <div role="tabpanel" className="thread" aria-hidden={String(!isSelected)}
        onContextMenu={this.handleContextMenu}
        onClick={this.handleClick}>
        <PostsComponent posts={posts} newPostNumber={newPostNumber} threadUrl={threadUrl} />
      </div>
    );
  }
}
