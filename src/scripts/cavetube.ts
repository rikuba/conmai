import { ipcRenderer } from 'electron';

import { collectPostData } from '../clients/cavetube';


document.addEventListener('DOMContentLoaded', (e) => {
  const container = document.getElementById('comment_container')!;

  let initialCommentsLoaded = false;

  const observer = new MutationObserver((mutations) => {
    const addedNodes = mutations.reduce((nodes, m) => nodes.concat(...m.addedNodes), [] as Node[]);

    if (!initialCommentsLoaded) {
      initialCommentsLoaded = true;
      return;
    }

    if (addedNodes.length === 0) {
      return;
    }

    const comments = (addedNodes as HTMLElement[])
      .map(collectPostData)
      .map((post) => ({ type: 'cavetube', ...post }));
    ipcRenderer.sendToHost('NEW_POSTS', comments);
  });

  observer.observe(container, {
    childList: true,
  });
});
