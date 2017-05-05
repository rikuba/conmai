import React from 'react';

import PostComponent from '../post/post';
import { Thread } from '../../reducers';

import './thread.css';

export default class ThreadComponent extends React.Component<Thread, any> {
  render() {
    const { posts } = this.props;

    return (
      <div className="thread">
        {posts.map((post, i) => {
          return <PostComponent key={i} {...post} />;
        })}
      </div>
    );
  }
}
