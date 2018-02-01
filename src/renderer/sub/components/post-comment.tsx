import { ipcRenderer } from 'electron';
import React from 'react';

import { setInnerHtmlSafely } from '../../../utils';
import { Post as ShitarabaPost } from '../../../clients/shitaraba-client';
import { Post as CavetubePost } from '../../../clients/cavetube';
import { Post as TwitchPost } from '../../../clients/twitch';

type Post =
  | { type: 'shitaraba' } & ShitarabaPost
  | { type: 'cavetube' } & CavetubePost
  | { type: 'twitch' } & TwitchPost;

function renderPost(post: Post): JSX.Element {
  switch (post.type) {
    case 'shitaraba':
      return <ShitarabaPostComponent {...post} />;

    case 'cavetube':
      return <CavetubePostComponent {...post} />;

    case 'twitch':
      return <TwitchPostComponent {...post} />;
  }
}

function ShitarabaPostComponent({ message }: ShitarabaPost) {
  return <p className="sub post-comment" ref={setInnerHtmlSafely(message)} />;
}

function CavetubePostComponent({ author, message }: CavetubePost) {
  let authorElm: React.ReactNode = null;
  if (author.name) {
    authorElm = author.name;
    if (author.url) {
      authorElm = <a href={author.url}>{authorElm}</a>;
    }
    authorElm = <span className="author">{authorElm}</span>;
  }

  return (
    <div className="sub post-comment">
      {authorElm}
      <span className="message">{message}</span>
    </div>
  );
}

function TwitchPostComponent({ author: { name, color }, message }: TwitchPost) {
  console.log(message);
  return (
    <div className="sub post-comment">
      <span className="author" style={{ color }}>
        {name}
      </span>
      <span className="message" ref={setInnerHtmlSafely(message)} />
    </div>
  );
}

type OwnState = {
  posts: Post[];
};

export default class PostComment extends React.Component<{}, OwnState> {
  private _handleNewPosts: any;

  state: OwnState = {
    posts: [],
  };

  handleNewPosts(event: any, newPosts: Post[]) {
    this.setState({
      posts: this.state.posts.concat(newPosts),
    });

    setTimeout(() => {
      this.setState({
        posts: this.state.posts.slice(newPosts.length),
      });
    }, 30 * 1000);
  }

  componentDidMount() {
    this._handleNewPosts = this.handleNewPosts.bind(this);
    ipcRenderer.on('new-posts', this._handleNewPosts);
  }

  componentWillUnMount() {
    ipcRenderer.removeListener('new-posts', this._handleNewPosts);
  }

  render() {
    return <div className="posts-container">{this.state.posts.map(renderPost)}</div>;
  }
}
