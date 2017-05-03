import React from 'react';

import Post, { PostProps } from '../post/post';

import './thread.css';

export interface ThreadProps {
  title: string;
  posts: PostProps[];
}

export default class ThreadComponent extends React.Component<ThreadProps, any> {
  render() {
    const {
      title = '',
      posts = [],
    } = this.props;

    return (
      <div className="thread">
        <h1 className="thread-title">{title}</h1>
        {posts.map((post, i) => {
          return <Post key={i} {...post} />;
        })}
      </div>
    );
  }
}
