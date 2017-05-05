import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import App from '../../components/app/app';
import configureStore from '../../store';

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
}

render();

if (module.hot) {
  module.hot.accept('../../components/app/app', render);
}
