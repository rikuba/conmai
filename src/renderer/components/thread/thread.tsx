import React from 'react';
import ReactDOM from 'react-dom';

import PostComponent from '../post/post';
import { Thread } from '../../reducers';

import './thread.css';

export default class ThreadComponent extends React.Component<Thread, any> {
  private lastNewPostNumber = 0;
  private isScrolledToTheEnd = true;

  constructor(props: Thread) {
    super(props);
  }

  componentDidUpdate() {
    const { newPostNumber } = this.props;
    if (newPostNumber !== this.lastNewPostNumber) {
      if (newPostNumber > 1 && this.isScrolledToTheEnd) {
        this.scrollToNewPost();
      }
      this.lastNewPostNumber = newPostNumber;
    }
  }

  scrollToNewPost() {
    const elm = ReactDOM.findDOMNode(this);
    elm.scrollTop = elm.scrollHeight - elm.clientHeight;
  }

  handleScroll = (e: any) => {
    const elm: HTMLDivElement = e.currentTarget;
    this.isScrolledToTheEnd = elm.scrollTop >= elm.scrollHeight - elm.clientHeight - 10;
  };

  render() {
    const { posts, newPostNumber } = this.props;
    const isNew = (number: number) => number >= newPostNumber;

    return (
      <div className="thread" onScroll={this.handleScroll}>
        {posts.map((post) => (
          <PostComponent key={post.number} isNew={isNew(post.number)} {...post} />
        ))}
      </div>
    );
  }
}
