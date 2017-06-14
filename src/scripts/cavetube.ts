import { ipcRenderer } from 'electron';

import { Post } from '../clients/cavetube';


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

    const comments = (addedNodes as HTMLElement[]).map(collectPosts);
    ipcRenderer.sendToHost('NEW_POSTS', comments);
  });

  observer.observe(container, {
    childList: true,
  });
});


function collectPosts(comment: HTMLElement): Post {
  const number = parseInt(comment.querySelector('.comment_number')!.textContent!, 10);

  const nameElm = comment.querySelector('.name')!;
  const author: Post['author'] = {
    name: nameElm.textContent!,
    url: null,
    iconUrl: null,
  };

  const nameAnchor = nameElm.querySelector('a');
  if (nameAnchor) {
    author.url = nameAnchor.href;
  }

  const iconImg = comment.querySelector('.user_icon img');
  if (iconImg) {
    author.iconUrl = (iconImg as HTMLImageElement).src;
  }

  const postedAt = Date.parse(comment.querySelector('.post_time')!.getAttribute('datetime')!);

  const message = comment.querySelector('.message')!.textContent!;

  return {
    number,
    author,
    postedAt,
    message,
  };
}
