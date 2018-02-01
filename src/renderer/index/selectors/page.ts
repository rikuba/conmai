import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';

import { State } from '../reducers';

export const getPage = createCachedSelector(
  (state: State) => state.pages.byId,
  (state: State, id: string) => id,
  (byId: any, id: any) => byId[id],
)((state: State, id: string) => id);

export const getSelectedPageId = (state: State) => state.pages.selectOrder[0];

export const getSelectedPage = createSelector(
  (state: State) => state.pages.selectOrder,
  (state: State) => state.pages.byId,
  (selectOrder, byId) => byId[selectOrder[0]],
);

export const getAllPages = createSelector(
  (state: State) => state.pages.all,
  (state: State) => state.pages.byId,
  (all, byId) => all.map((id) => byId[id]),
);

export const getPagesByUrl = (state: State, url: string) => {
  return getAllPages(state).filter((page) => page.url === url);
};

export const clearPageCache = (id: string) => {
  getPage.removeMatchingSelector({} as State, id);
};
