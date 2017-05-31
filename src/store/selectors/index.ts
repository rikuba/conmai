import { createSelector } from 'reselect';

import { State } from '../reducers';

export const getUpdateIntervalPreference = createSelector(
  (state: State) => state.preferences.updateInterval,
  (updateInterval) => updateInterval,
);

export const getThread = createSelector(
  (state: State) => state.threads.byUrl,
  (state: State, url: string) => url,
  (byUrl, url) => byUrl[url],
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

export const getLastPost = createSelector(
  (state: State) => state.posts,
  (state: State, threadUrl: string) => threadUrl,
  (posts, threadUrl) => {
    let i = posts.length;
    while (i--) {
      const post = posts[i];
      if (post.thread === threadUrl) {
        return post;
      }
    }
    return null;
  }
);

export const makeGetPosts = () => createSelector(
  (state: State) => state.posts,
  (state: State, threadUrl: string) => threadUrl,
  (posts, threadUrl) => posts.filter((post) => post.thread === threadUrl),
);

export const getThreadWaits = createSelector(
  (state: State) => state.threadWaits,
  (state: State, threadUrl: string) => threadUrl,
  (threadWaits, threadUrl) => threadWaits[threadUrl],
);
