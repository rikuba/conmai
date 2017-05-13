import React from 'react';
import ReactDOM from 'react-dom';

import PostsComponent from '../posts/posts';
import { Thread } from '../../reducers';

import './thread.css';

type Props = Thread & OwnProps;

interface OwnProps {
  isSelected: boolean;
}

export default class ThreadComponent extends React.PureComponent<Props, any> {
  private lastNewPostNumber = 0;
  private isScrolledToTheEnd = true;

  componentWillReceiveProps(nextProps: Readonly<Props>) {
    const elm = ReactDOM.findDOMNode(this);
    this.isScrolledToTheEnd = elm.scrollTop >= elm.scrollHeight - elm.clientHeight - 10;
  }

  componentDidUpdate() {
    const { newPostNumber } = this.props;
    if (newPostNumber && newPostNumber > 1 && this.isScrolledToTheEnd) {
      this.scrollToNewPost();
    }
  }

  scrollToNewPost() {
    const elm = ReactDOM.findDOMNode(this);
    elm.scrollTop = elm.scrollHeight - elm.clientHeight;
  }

  render() {
    const { posts, newPostNumber, isSelected } = this.props;

    return (
      <div className="thread" data-is-selected={isSelected}>
        <PostsComponent posts={posts} newPostNumber={newPostNumber} />
      </div>
    );
  }
}
