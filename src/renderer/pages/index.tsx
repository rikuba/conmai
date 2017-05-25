import { ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import App from '../components/app';
import configureStore from '../../store';
import { openThread, subWindowClosed } from '../../actions';

import './index.css';

const store = configureStore();

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render();

if (module.hot) {
  module.hot.accept('../components/app', render);
}

ipcRenderer.on('sub-window-closed', () => {
  store.dispatch(subWindowClosed());
});


let lastThreads: string[] | null = null;

store.subscribe(() => {
  const state = store.getState();
  const threads = state.threads.all;
  if (threads === lastThreads) {
    return;
  }
  lastThreads = threads;
  localStorage.setItem('threads.all', JSON.stringify(threads));
});


const threadsJson = localStorage.getItem('threads.all');
const threads: string[] = threadsJson ? JSON.parse(threadsJson) : [];

threads.forEach((url) => {
  store.dispatch(openThread(url));
});
