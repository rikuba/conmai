import { ipcRenderer, remote } from 'electron';
import debounce from 'lodash.debounce';

import { Post } from '../../store/reducers';

import './sub.css';

const myCommentContextMenu = remote.Menu.buildFromTemplate([
  { role: 'undo', label: '元に戻す' },
  { type: 'separator' },
  { role: 'cut', label: '切り取り' },
  { role: 'copy', label: 'コピー' },
  { role: 'paste', label: '貼り付け' },
  { role: 'delete', label: '削除' },
  { type: 'separator' },
  { role: 'selectall', label: 'すべて選択' },
]);

const postCommentContextMenu = remote.Menu.buildFromTemplate([
  { role: 'copy', label: 'コピー' },
  { role: 'selectall', label: 'すべて選択' },
]);

const posts: Post[] = [];
let myComment = localStorage.getItem('my-comment') || '';
let startTime: number;
let timerId: any;

ipcRenderer.on('new-posts', (e, newPosts: Post[]) => {
  posts.push(...newPosts);
});

showPost();

function showPost() {
  const post = posts.shift();
  if (!post) {
    render();
    timerId = setTimeout(showPost, 1000);
    return;
  }

  render(post);
  startTime = Date.now();
  timerId = setTimeout(showPost, 10 * 1000 / (posts.length + 1));
}

const myCommentElement = document.querySelector('.my-comment') as HTMLParagraphElement;
myCommentElement.textContent = myComment;

const handleInput = debounce((e: any) => {
  localStorage.setItem('my-comment', myCommentElement.textContent!);
}, 2000);
myCommentElement.addEventListener('input', handleInput);

myCommentElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  myCommentContextMenu.popup();
});

const postCommentElement = document.querySelector('.post-comment') as HTMLParagraphElement;

postCommentElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  postCommentContextMenu.popup();
});

function render(post?: Post): void {
  document.querySelector('.post-comment')!.innerHTML = post ? post.message : '';
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.matches('a, a *')) {
    e.preventDefault();
  }
});

window.addEventListener('focus', (e) => {
  document.documentElement.classList.add('active');
  ipcRenderer.send('set-subwindow-is-ignore-mouse-events', false);

  myCommentElement.focus();
});

window.addEventListener('blur', (e) => {
  document.documentElement.classList.remove('active');
  ipcRenderer.send('set-subwindow-is-ignore-mouse-events', true);

  getSelection().removeAllRanges();
});
