import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { electronEnhancer } from 'redux-electron-store';

import rootReducer, { State } from '../store/reducers';

export function configureStore() {
  let enhancer: any = compose(
    applyMiddleware(thunk),
    electronEnhancer({
      dispatchProxy: (action: any) => store.dispatch(action),
    }),
  );

  if (process.env.NODE_ENV === 'development' && process.type === 'renderer') {
    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(enhancer);
  }

  let store = createStore<State>(
    rootReducer,
    enhancer
  );

  return store;
}
