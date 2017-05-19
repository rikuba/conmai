import React, { ReactElement, ReactNode } from 'react';

import { Post } from '../reducers';

import './post.css';

interface Props {
  isNew: boolean;
  post: Post;
}

export default class PostComponent extends React.PureComponent<Props, any> {
  render() {
    const { isNew, post } = this.props;
    return (
      <article
        className="post"
        data-number={post.number}
        data-is-new={isNew}>
        <header className="post-header">
          <span className="post-number">{post.number}</span>
          <span className="post-name" ref={setInnerHTML(post.name)}></span>
          <span className="post-mail">{post.mail}</span>
          <span className="post-date">{post.date}</span>
          <span className="post-id">{post.id}</span>
        </header>
        <p className="post-message" ref={setInnerHTML(post.message)}></p>
      </article>
    );
  }
}

const setInnerHTML = (html: string) => (element: HTMLElement | null): void => {
  if (element) {
    element.innerHTML = html;
  }
};