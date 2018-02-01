import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

import './sub.css';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

render();

if (module.hot) {
  module.hot.accept('./components/app', render);
}

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

if (document.hasFocus()) {
  window.dispatchEvent(new FocusEvent('focus'));
}
