import { ipcRenderer } from 'electron';
import React from 'react';

import { Post } from '../reducers';

import './sub.css';

const posts: Post[] = [];
let defaultMessage = '';
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

function render(post?: Post): void {
  document.querySelector('h1')!.innerHTML = post ? post.message : defaultMessage;
}
