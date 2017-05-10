import React from 'react';
import ReactDOM from 'react-dom';

import PostComponent from '../post/post';
import { Thread } from '../../reducers';

import './thread.css';

export default class ThreadComponent extends React.Component<Thread, any> {
  private lastNewPostNumber = 0;

  componentDidUpdate() {
    const { newPostNumber } = this.props;
    if (newPostNumber !== this.lastNewPostNumber) {
      if (newPostNumber > 1) {
        this.scrollToNewPost();
      }
      this.lastNewPostNumber = newPostNumber;
    }
  }

  scrollToNewPost() {
    const newPost = ReactDOM.findDOMNode(this).querySelector('.post[data-is-new="true"]');
    if (newPost) {
      newPost.scrollIntoView();
    }
  }

  render() {
    const { posts, newPostNumber } = this.props;
    const isNew = (number: number) => number >= newPostNumber;

    return (
      <div className="thread">
        {posts.map((post) => (
          <PostComponent key={post.number} isNew={isNew(post.number)} {...post} />
        ))}
      </div>
    );
  }
}
