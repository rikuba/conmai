import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import App from './components/app';
import { configureStore } from './store';
import { openPage } from './actions';
import * as selectors from './selectors';

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
  module.hot.accept('./components/app', render);
}


let lastPageUrls: string[] | null = null;

(function restorePages() {
  const pages = selectors.getAllPages(store.getState());
  if (pages.length > 0) {
    // HMR
    return;
  }

  const json = localStorage.getItem('pageUrls');
  if (json) {
    try {
      const pageUrls = JSON.parse(json);
      pageUrls.forEach((url: string) => {
        store.dispatch(openPage(url));
      });
    } catch (e) {
      localStorage.removeItem('pageUrls');
    }
  }
})();

store.subscribe(() => {
  const pageUrls = selectors.getAllPages(store.getState()).map((page) => page.url);
  if (pageUrls === lastPageUrls) {
    return;
  }

  lastPageUrls = pageUrls;
  localStorage.setItem('pageUrls', JSON.stringify(pageUrls));
});
