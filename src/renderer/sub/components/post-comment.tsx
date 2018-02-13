import React from 'react';
import { connect, Dispatch } from 'react-redux';

import { setInnerHtmlSafely } from '../../../utils';
import { Post as ShitarabaPost } from '../../../services/shitaraba';
import { Post as CavetubePost } from '../../../services/cavetube';
import { Post as TwitchPost } from '../../../services/twitch';
import { State, PostState, postOutOfDate, subscribePosts, unsubscribePosts } from '../store';

export type Post =
  | { type: 'shitaraba' } & ShitarabaPost
  | { type: 'cavetube' } & CavetubePost
  | { type: 'twitch' } & TwitchPost;

namespace PostContainer {
  export type Props = React.Props<void> & OwnProps;

  type OwnProps = {
    post: PostState;
    onStale: (id: string) => void;
  };
}

class PostContainer extends React.Component<PostContainer.Props> {
  tid: any = null;

  componentDidMount() {
    this.tid = setTimeout(() => {
      this.props.onStale(this.props.post._id);
    }, 30 * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.tid);
  }

  render() {
    const { post } = this.props;

    let element: React.ReactElement<any> | null = null;
    switch (post.type) {
      case 'shitaraba':
        element = <ShitarabaPostComponent {...post} />;
        break;

      case 'cavetube':
        element = <CavetubePostComponent {...post} />;
        break;

      case 'twitch':
        element = <TwitchPostComponent {...post} />;
        break;
    }

    return (
      <div className="post" data-is-stale={this.props.post.isStale}>
        {element}
      </div>
    );
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
  return (
    <div className="sub post-comment">
      <span className="author" style={{ color }}>
        {name}
      </span>
      <span className="message" ref={setInnerHtmlSafely(message)} />
    </div>
  );
}

namespace PostsContainer {
  export type Props = React.Props<any> & StateProps & DispatchProps;

  type StateProps = {
    posts: PostState[];
  };

  type DispatchProps = {
    onReady: () => void;
    onDispose: () => void;
    onPostStale: (id: string) => void;
  };
}

class PostsContainer extends React.Component<PostsContainer.Props> {
  componentDidMount() {
    this.props.onReady();
  }

  componentWillUnMount() {
    this.props.onDispose();
  }

  render() {
    return (
      <div className="posts-container">
        {this.props.posts.map((post) => (
          <PostContainer key={post._id} post={post} onStale={this.handlePostStale} />
        ))}
      </div>
    );
  }

  handlePostStale = (id: string) => {
    this.props.onPostStale(id);
  };
}

const mapStateToProps = (state: State) => ({
  posts: state.posts,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  onReady: () => {
    dispatch(subscribePosts());
  },
  onDispose: () => {
    dispatch(unsubscribePosts());
  },
  onPostStale: (id: string) => {
    dispatch(postOutOfDate(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PostsContainer);
