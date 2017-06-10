import { ipcRenderer } from 'electron';
import React from 'react';

import { Post } from '../../store/reducers';
import PostComponent from './post';

type Props = React.Props<any> & OwnProps;

type OwnProps = {
  posts: Post[];
  newPostNumber: number | null;
  threadUrl: string;
};

export default class PostsComponent extends React.PureComponent<Props, {}> {
  render() {
    const { posts, newPostNumber, threadUrl } = this.props;
    const isNew = newPostNumber ?
      (number: number) => number >= newPostNumber :
      (number: number) => false;

    // Deliver new posts to sub window
    if (newPostNumber && newPostNumber > 1) {
      const i = posts.findIndex((post) => post.number === newPostNumber);
      const newPosts = posts.slice(i);
      ipcRenderer.send('new-posts', newPosts);
    }

    return (
      <div className="posts">
        {posts.map((post) => (
          <PostComponent key={post.number}
            isNew={isNew(post.number)}
            post={post}
            threadUrl={threadUrl} />
        ))}
      </div>
    );
  }
}
