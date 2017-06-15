import { ipcRenderer } from 'electron';

import { collectPostData } from '../clients/twitch';

setTimeout(function next() {
  const container = document.querySelector('.chat-lines');
  if (!container) {
    return setTimeout(next, 16);
  }
  
  startObserve(container);
}, 64);

const startObserve = (container: Element) => {
  let initialCommentsLoaded = false;

  const observer = new MutationObserver((mutations) => {
    const postElms = mutations.reduce((nodes, m) => {
      return nodes.concat(
        [...m.addedNodes]
          .filter((node) => node.nodeType === Node.ELEMENT_NODE) as HTMLElement[]
      );
    }, [] as HTMLElement[]);

    if (!initialCommentsLoaded) {
      initialCommentsLoaded = true;
      return;
    }

    if (postElms.length === 0) {
      return;
    }

    const comments = postElms.map(collectPostData);
    ipcRenderer.sendToHost('NEW_POSTS', comments);
  });

  observer.observe(container, {
    childList: true,
  });
};
