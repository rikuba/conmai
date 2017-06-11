import { ipcRenderer, remote } from 'electron';
import React from 'react';

import { setInnerHTML } from '../../../utils';
import { Post } from '../../index/reducers';

type OwnState = {
  text: string;
};

export default class PostComment extends React.Component<{}, OwnState> {
  private posts: Post[] = [];
  private consumeTime = 10 * 1000;
  private timerId: any = 0;

  state = {
    text: '',
  };

  renderLoop = () => {
    const post = this.posts.shift();
    const text = post ? post.message : '';
    this.setState({ text });

    const time = post ? this.consumeTime / (this.posts.length + 1) : 1000;
    this.timerId = setTimeout(this.renderLoop, time);
  };

  handleNewPosts = (event: any, newPosts: Post[]) => {
    this.posts.push(...newPosts);
  };

  componentDidMount() {
    ipcRenderer.on('new-posts', this.handleNewPosts);
    this.renderLoop();
  }

  componentWillUnMount() {
    ipcRenderer.removeListener('new-posts', this.handleNewPosts);
    clearTimeout(this.timerId);
  }

  private contextMenu = remote.Menu.buildFromTemplate([
    { role: 'copy', label: 'コピー' },
    { role: 'selectall', label: 'すべて選択' },
  ]);

  handleContextMenu: React.MouseEventHandler<HTMLParagraphElement> = (e) => {
    e.preventDefault();

    this.contextMenu.popup();
  };

  render() {
    const { text } = this.state;

    return (
      <p className="sub post-comment"
        onContextMenu={this.handleContextMenu}
        ref={setInnerHTML(text)}
      ></p>
    );
  }
}
