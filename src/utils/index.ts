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
