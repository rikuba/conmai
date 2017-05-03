import React from 'react';

import Post, { PostProps } from '../post/post';

import css from './thread.css';

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
      <div className={css.thread}>
        <h1 className={css.threadTitle}>{title}</h1>
        {posts.map((post, i) => {
          return <Post key={i} {...post} />;
        })}
      </div>
    );
  }
}
