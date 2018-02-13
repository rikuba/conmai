import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { remote, ipcRenderer } from 'electron';
import { pageTitleUpdated } from '../../actions';
import { fetchThread, Post } from '../../../../services/shitaraba';

import './thread.css';

type Props = React.Props<any> & OwnProps & DispatchProps;

interface OwnProps {
  id: string;
  url: string;
}

interface DispatchProps {
  onPageTitleUpdated: (title: string) => void;
}

interface State {
  posts: Post[];
  error?: Error;
}

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: OwnProps): DispatchProps => ({
  onPageTitleUpdated: (title) => {
    dispatch(pageTitleUpdated(ownProps.id, title));
  },
});

class ShitarabaThreadContainer extends React.Component<Props, State> {
  state: State = {
    posts: [],
    error: void 0,
  };

  componentDidMount() {
    this.fetchStart();
  }

  componentWillUnmount() {
    this.fetchStop();
  }

  render() {
    const { posts, error } = this.state;
    const alt = error ? 'レスを取得できませんでした' : 'レスを取得中です';
    return (
      <div
        className="shitaraba-thread-container"
        ref={(e) => e && (this.element = e)}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}>
        <ShitarabaThread posts={posts} alt={alt} />
      </div>
    );
  }

  private element: HTMLElement | null = null;

  private fetchStop = () => {};

  private contextMenu = remote.Menu.buildFromTemplate([
    { role: 'copy', label: 'コピー' },
    { role: 'selectall', label: 'すべて選択' },
    { type: 'separator' },
    {
      label: 'スレッドの先頭へ',
      click: () => {
        this.scrollToTop();
      },
    },
    {
      label: 'スレッドの末尾へ',
      click: () => {
        this.scrollToBottom();
      },
    },
  ]);

  private async fetchStart() {
    const { url } = this.props;
    try {
      const { posts, title } = await fetchThread(url);
      this.props.onPageTitleUpdated(title);
      this.setState({ posts, error: void 0 });
    } catch (error) {
      this.setState({ error });
    }

    for (;;) {
      try {
        await new Promise((resolve, reject) => {
          const timerId = setTimeout(resolve, 10 * 1000);
          this.fetchStop = () => {
            clearTimeout(timerId);
            reject(new Error('Cancelled'));
          };
        });
      } catch (error) {
        break;
      }

      const lastPost = this.state.posts[this.state.posts.length - 1];
      const from = lastPost.number + 1;
      try {
        const { posts } = await fetchThread(url, { from });
        ipcRenderer.send(
          'new-posts',
          posts.map((post) => ({
            type: 'shitaraba',
            ...post,
          })),
        );
        this.setState({
          posts: [...this.state.posts, ...posts],
          error: void 0,
        });
        this.scrollToPost(from);
      } catch (error) {
        this.setState({ error });
      }
    }
  }

  private handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.matches('a')) {
      e.preventDefault();
      const m = /^>>(\d+)$/.exec(target.textContent!);
      if (m) {
        this.scrollToPost(m[1]);
      }
    }
  };

  private handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.contextMenu.popup(remote.getCurrentWindow());
  };

  private scrollToPost(number: number | string) {
    const post = this.element!.querySelector(`.shitaraba-post[data-number="${number}"]`);
    if (post) {
      post.scrollIntoView();
    }
  }

  private scrollToTop() {
    this.element!.scrollTop = 0;
  }

  private scrollToBottom() {
    const element = this.element!;
    element.scrollTop = element.scrollHeight - element.clientHeight;
  }
}

const ShitarabaThread = (props: { posts: Post[]; alt?: string }) => (
  <div className="shitaraba-thread">
    {props.posts.length > 0 ? (
      props.posts.map((post) => <ShitarabaPost key={post.number} {...post} />)
    ) : (
      <p>{props.alt || ''}</p>
    )}
  </div>
);

const ShitarabaPost = (props: Post) => (
  <article className="shitaraba-post" data-number={props.number}>
    <header className="shitaraba-post-header">
      <span className="shitaraba-post-number">{props.number}</span>
      <span className="shitaraba-post-name" dangerouslySetInnerHTML={{ __html: props.name }} />
      <span className="shitaraba-post-mail">{props.mail}</span>
      <span className="shitaraba-post-date">{props.date}</span>
      <span className="shitaraba-post-id">{props.id}</span>
    </header>
    <p className="shitaraba-post-message" dangerouslySetInnerHTML={{ __html: props.message }} />
  </article>
);

export default connect(null, mapDispatchToProps)(ShitarabaThreadContainer);
