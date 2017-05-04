import React from 'react';

import PostComponent from '../post/post';
import { Thread } from '../../reducers';

import './thread.css';

export default class ThreadComponent extends React.Component<Thread, any> {
  render() {
    const {
      title,
      posts,
    } = this.props;

    return (
      <div className="thread">
        <h1 className="thread-title">{title}</h1>
        {posts.map((post, i) => {
          return <PostComponent key={i} {...post} />;
        })}
      </div>
    );
  }
}
