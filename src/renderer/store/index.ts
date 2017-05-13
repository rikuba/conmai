import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer, { State } from '../reducers';

export default function configureStore() {
  let enhancer = applyMiddleware(thunk);

  if (process.env.NODE_ENV === 'development') {
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(enhancer);
  }

  return createStore<State>(
    rootReducer,
    enhancer
  );
}
