import React, { ReactElement, ReactNode } from 'react';

import { Post } from '../../reducers';

import './post.css';

interface Props extends Post {
  isNew: boolean;
}

export default class PostComponent extends React.Component<Props, any> {
  render() {
    return (
      <article
        className={`post ${this.props.isNew ? 'new' : ''}`}
        data-number={this.props.number}>
        <header className="post-header">
          <span className="post-number">{this.props.number}</span>
          <span className="post-name">{this.props.name}</span>
          <span className="post-mail">{this.props.mail}</span>
          <span className="post-date">{this.props.date}</span>
          <span className="post-id">{this.props.id}</span>
        </header>
        <p className="post-message" ref={setInnerHTML(this.props.message)}></p>
      </article>
    );
  }
}

const setInnerHTML = (html: string) => (element: HTMLElement | null): void => {
  if (element) {
    element.innerHTML = html;
  }
};
