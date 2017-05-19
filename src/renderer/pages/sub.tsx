import { ipcRenderer } from 'electron';
import debounce from 'lodash.debounce';

import { Post } from '../reducers';

import './sub.css';

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

const myCommentElement = document.querySelector('.my-comment') as HTMLDivElement;
myCommentElement.textContent = myComment;

const handleInput = debounce((e: any) => {
  localStorage.setItem('my-comment', myCommentElement.textContent!);
}, 2000);
myCommentElement.addEventListener('input', handleInput);

function render(post?: Post): void {
  document.querySelector('.post-comment')!.innerHTML = post ? post.message : '';
}

window.addEventListener('focus', (e) => {
  document.documentElement.classList.add('active');
  ipcRenderer.send('set-subwindow-is-ignore-mouse-events', false);

  myCommentElement.focus();
});

window.addEventListener('blur', (e) => {
  document.documentElement.classList.remove('active');
  ipcRenderer.send('set-subwindow-is-ignore-mouse-events', true);
});
