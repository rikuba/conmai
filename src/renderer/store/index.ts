import { createStore } from 'redux';

import rootReducer from '../reducers';

export default function configureStore() {
  if (process.env.NODE_ENV === 'development') {
    return createStore(
      rootReducer,
      window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()
    );
  }

  return createStore(rootReducer);
}
