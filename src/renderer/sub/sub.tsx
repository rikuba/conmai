import { ipcRenderer, remote } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash.debounce';

import { Post } from '../index/reducers';
import { setInnerHTML } from '../../utils';

import './sub.css';


window.addEventListener('focus', (e) => {
  document.documentElement.classList.add('active');
  ipcRenderer.send('set-subwindow-is-ignore-mouse-events', false);

  const myCommentElement = document.querySelector('.my-comment') as HTMLElement;
  myCommentElement.focus();
});

window.addEventListener('blur', (e) => {
  document.documentElement.classList.remove('active');
  ipcRenderer.send('set-subwindow-is-ignore-mouse-events', true);

  getSelection().removeAllRanges();
});


class SubPage extends React.Component<{}, {}> {
  handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;
    
    if (target.matches('a, a *')) {
      e.preventDefault();
    }
  };

  render() {
    return (
      <div className="sub-page"
        onClick={this.handleClick}>
        <MyComment />
        <PostComment />
      </div>
    );
  }
}


class MyComment extends React.Component<{}, { text?: string }> {
  state = {
    text: localStorage.getItem('my-comment') || '',
  };

  handleInput = debounce(() => {
    const elm = ReactDOM.findDOMNode(this);
    const text = elm.textContent!;
    localStorage.setItem('my-comment', text);
  }, 1000);

  private contextMenu = remote.Menu.buildFromTemplate([
    { role: 'undo', label: '元に戻す' },
    { type: 'separator' },
    { role: 'cut', label: '切り取り' },
    { role: 'copy', label: 'コピー' },
    { role: 'paste', label: '貼り付け' },
    { role: 'delete', label: '削除' },
    { type: 'separator' },
    { role: 'selectall', label: 'すべて選択' },
  ]);

  handleContextMenu: React.MouseEventHandler<HTMLParagraphElement> = (e) => {
    e.preventDefault();

    this.contextMenu.popup();
  };

  render() {
    const { text } = this.state;

    return (
      <p className="sub my-comment"
        contentEditable
        onInput={this.handleInput}
        onContextMenu={this.handleContextMenu}
      >{text}</p>
    );
  }
}


class PostComment extends React.Component<{}, { text: string }> {
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


ReactDOM.render(
  <SubPage />,
  document.getElementById('root'),
);
