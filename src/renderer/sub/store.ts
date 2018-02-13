import { combineReducers, compose, createStore, Dispatch } from 'redux';
import thunk from 'redux-thunk';
import { electronEnhancer } from 'redux-electron-store';
import { ipcRenderer } from 'electron';
import uuid from 'uuid/v4';
import { Post } from './components/post-comment';
import { applyMiddleware } from 'redux';

// Actions

export type Action = Actions[keyof Actions] | { type: '' };

interface Actions {
  ReceivePosts: {
    type: 'RECEIVE_POSTS';
    posts: Post[];
  };
}

export const receivePosts = (posts: Post[]): Actions['ReceivePosts'] => ({
  type: 'RECEIVE_POSTS',
  posts,
});

interface Actions {
  PostOutOfDate: {
    type: 'POST_OUT_OF_DATE';
    id: string;
  };
}

export const postOutOfDate = (id: string): Actions['PostOutOfDate'] => ({
  type: 'POST_OUT_OF_DATE',
  id,
});

export const subscribePosts = () => (dispatch: Dispatch<State>) => {
  ipcRenderer.on('new-posts', (event: any, posts: Post[]) => {
    dispatch(receivePosts(posts));
  });
};

export const unsubscribePosts = () => (dispatch: Dispatch<State>) => {
  ipcRenderer.removeAllListeners('new-posts');
};

// Reducer

export type State = {
  posts: PostState[];
};

export type PostState = Post & {
  _id: string;
  isStale: boolean;
};

function posts(state: PostState[] = [], action: Action): typeof state {
  switch (action.type) {
    case 'RECEIVE_POSTS':
      const posts = action.posts.map((post) => ({
        ...post,
        _id: uuid(),
        isStale: false,
      }));
      return state.concat(posts);

    case 'POST_OUT_OF_DATE':
      return state.map((post) => {
        if (post._id !== action.id) {
          return post;
        }
        return {
          ...post,
          isStale: true,
        };
      });

    default:
      return state;
  }
}

const rootReducer = combineReducers<State>({ posts });

// Store

export function configureStore(preloadedState?: State) {
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

  let store = createStore<State>(rootReducer, preloadedState || ({} as State), enhancer);

  return store;
}
