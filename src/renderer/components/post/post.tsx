import React from 'react';

import { Post } from '../../reducers';

import './post.css';

export default class PostComponent extends React.Component<Post, any> {
  render() {
    return (
      <article className="post">
        <header>
          <span className="post-number">{this.props.number}</span>
          <span className="post-name">{this.props.name}</span>
          <span className="post-mail">{this.props.mail}</span>
          <span className="post-date">{this.props.date}</span>
          <span className="post-id">{this.props.id}</span>
        </header>
        <p className="post-message">{this.props.message}</p>
      </article>
    );
  }
}
