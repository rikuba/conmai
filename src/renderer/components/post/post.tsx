import React from 'react';

import './post.css';

export interface PostProps {
  number: number;
  name: string;
  mail: string;
  date: string;
  message: string;
  id: string;
}

export default class PostComponent extends React.Component<PostProps, any> {
  render() {
    const {
      number,
      name,
      mail,
      date,
      message,
      id,
    } = this.props;

    return (
      <article className="post">
        <header>
          <span className="post-number">{number}</span>
          <span className="post-name">{name}</span>
          <span className="post-mail">{mail}</span>
          <span className="post-date">{date}</span>
          <span className="post-id">{id}</span>
        </header>
        <p className="post-message">{message}</p>
      </article>
    );
  }
}
