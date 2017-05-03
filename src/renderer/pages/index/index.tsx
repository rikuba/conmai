import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from '../../components/app/app';
import configureStore from '../../store';

import './index.css';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
