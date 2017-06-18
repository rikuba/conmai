import { Store } from 'redux';

import { parseThreadUrl } from '../clients/shitaraba-client';

export function generatePostId(url: string, postNumber: number): string {
  const urlData = parseThreadUrl(url);
  if (!urlData) {
    return url.replace(/\W+/g, '-');
  }

  return `jbbs-post-${urlData.dir}-${urlData.board}-${urlData.thread}-${postNumber}`;
}


export const setInnerHTML = (html: string) => (element: Element | null) => {
  if (element) {
    element.innerHTML = html;
  }
};

export function observeStore<T, U>(store: Store<T>, select: (state: T) => U, onChange: (value: U) => void) {
  let currentState = select(store.getState());

  return store.subscribe(() => {
    const nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  });
}
