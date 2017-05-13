import React, { ReactElement, ReactNode } from 'react';

import { Post } from '../../reducers';
import PostComponent from '../post/post';

interface Props {
  posts: Post[];
  newPostNumber: number | null;
}

export default class PostsComponent extends React.PureComponent<Props, {}> {
  render() {
    const { posts, newPostNumber } = this.props;
    const isNew = newPostNumber ?
      (number: number) => number >= newPostNumber :
      (number: number) => false;

    return (
      <div className="posts">
        {posts.map((post) => (
          <PostComponent key={post.number} isNew={isNew(post.number)} post={post} />
        ))}
      </div>
    );
  }
}
