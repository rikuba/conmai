import React from 'react';
import ReactDOM from 'react-dom';

import PostComponent from '../post/post';
import { Thread } from '../../reducers';

import './thread.css';

export default class ThreadComponent extends React.Component<Thread, any> {
  componentDidUpdate() {
    const { newPostNumber } = this.props;
    if (newPostNumber) {
      const newPost = ReactDOM.findDOMNode(this)
        .querySelector(`.post[data-number="${newPostNumber}"]`);
      if (newPost) {
        newPost.scrollIntoView();
      }
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
