import React from 'react';

import css from './post.css';

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
      <article className={css.post}>
        <header>
          <span className={css.number}>{number}</span>
          <span className={css.name}>{name}</span>
          <span className={css.mail}>{mail}</span>
          <span className={css.date}>{date}</span>
          <span className={css.id}>{id}</span>
        </header>
        <p className={css.message}>{message}</p>
      </article>
    );
  }
}
