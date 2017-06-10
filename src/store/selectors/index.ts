import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { State } from '../reducers';

export const getUpdateIntervalPreference =
  (state: State) => state.preferences.updateInterval;

export const getThread = createCachedSelector(
  (state: State) => state.threads.byUrl,
  (state: State, url: string) => url,
  (byUrl: any, url: any) => byUrl[url],
)(
  (state: State, url: string) => url,
);

export const getSelectedThread = createSelector(
  (state: State) => state.threads.selectOrder,
  (state: State) => state.threads.byUrl,
  (selectOrder, byUrl) => byUrl[selectOrder[0]],
);

export const getAllThreads = createSelector(
  (state: State) => state.threads.all,
  (state: State) => state.threads.byUrl,
  (all, byUrl) => all.map((url) => byUrl[url]),
);

export const getLastPost = createCachedSelector(
  (state: State) => state.posts,
  (state: State, threadUrl: string) => threadUrl,
  (posts: any, threadUrl: any) => {
    let i = posts.length;
    while (i--) {
      const post = posts[i];
      if (post.thread === threadUrl) {
        return post;
      }
    }
    return null;
  }
)(
  (state: State, threadUrl: string) => threadUrl,
);

export const getPosts = createCachedSelector(
  (state: State) => state.posts,
  (state: State, threadUrl: string) => threadUrl,
  (posts: any, threadUrl: any) => posts.filter((post: any) => post.thread === threadUrl),
)(
  (state: State, threadUrl: string) => threadUrl,
);

export function clearThreadRelatedCache(url: string) {
  [getThread, getLastPost, getPosts].forEach((selector) => {
    selector.removeMatchingSelector(void 0, url);
  });
}
