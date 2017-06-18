import { ipcRenderer } from 'electron';
import React from 'react';

import { setInnerHTML } from '../../../utils';
import { Post as ShitarabaPost } from '../../../clients/shitaraba-client';
import { Post as CavetubePost } from '../../../clients/cavetube';
import { Post as TwitchPost } from '../../../clients/twitch';


type Post = 
  { type: 'shitaraba' } & ShitarabaPost |
  { type: 'cavetube'} & CavetubePost |
  { type: 'twitch' } & TwitchPost;


function ShitarabaPostComponent({ message }: ShitarabaPost) {
  return (
    <p className="sub post-comment"
      ref={setInnerHTML(message)}
    ></p>
  );
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

function TwitchPostComponent({ message }: TwitchPost) {
  console.log(message);
  return (
    <p className="sub post-comment" ref={setInnerHTML(message)}></p>
  );
}


type OwnState = {
  post: Post | null;
};

export default class PostComment extends React.Component<{}, OwnState> {
  private posts: Post[] = [];
  private consumeTime = 10 * 1000;
  private renderStart: number = 0;
  private timerId: any = 0;

  state: OwnState = {
    post: null,
  };

  rescheduleRender() {
    clearTimeout(this.timerId);
    const renderTime = Date.now() - this.renderStart;
    const next = this.consumeTime / (this.posts.length + 1) - renderTime;

    if (next <= 0) {
      this.renderNextPost();
      return;
    }

    this.timerId = setTimeout(this.renderNextPost, next);
  }

  renderNextPost = () => {
    const post = this.posts.shift() || null;
    this.setState({ post });

    if (post) {
      this.renderStart = Date.now();

      const next = this.consumeTime / (this.posts.length + 1);
      this.timerId = setTimeout(this.renderNextPost, next);
    }
  };

  handleNewPosts = (event: any, newPosts: Post[]) => {
    const reschedule = this.state.post != null;
    this.posts.push(...newPosts);
    if (reschedule) {
      this.rescheduleRender();
    } else {
      this.renderNextPost();
    }
  };

  componentDidMount() {
    ipcRenderer.on('new-posts', this.handleNewPosts);
  }

  componentWillUnMount() {
    ipcRenderer.removeListener('new-posts', this.handleNewPosts);
    clearTimeout(this.timerId);
  }

  render() {
    const { post } = this.state;

    if (post == null) {
      return <div />;
    }

    switch (post.type) {
      case 'shitaraba':
        return <ShitarabaPostComponent {...(post as ShitarabaPost)} />;

      case 'cavetube':
        return <CavetubePostComponent {...(post as CavetubePost)} />;

      case 'twitch':
        return <TwitchPostComponent {...(post as TwitchPost)} />;
    }
  }
}
