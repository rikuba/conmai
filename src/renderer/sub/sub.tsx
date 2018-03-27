import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app';
import { configureStore } from './store';

import './sub.css';

const store = configureStore();

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
};

render();

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
