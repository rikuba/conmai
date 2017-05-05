import React, { ReactElement, ReactNode } from 'react';

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
        <p className="post-message">{processMessage(parseEntities(this.props.message))}</p>
      </article>
    );
  }
}

function processMessage(message: string): ReactNode[] {
  const nodes: ReactNode[] = [];

  const re_tags = /<a href="([^"]*)" target="_blank">([^<]*)<\/a>|<(br)>/g;
  let key = 0;
  let match: RegExpExecArray | null = null;
  let lastIndex = 0;
  
  while ((match = re_tags.exec(message))) {
    const { index } = match;
    const text = message.slice(lastIndex, index);
    lastIndex = index + match[0].length;
    nodes.push(text);
    
    if (match[1]) {
      nodes.push(<a href={match[1]} key={key++}>{match[2]}</a>);
    } else if (match[3]) {
      nodes.push(<br key={key++} />);
    }
  }

  if (lastIndex < message.length) {
    const text = message.slice(lastIndex);
    nodes.push(text);
  }

  return nodes;
}

const option = new Option('');

function parseEntities(string: string): string {
  return string.replace(/&(?:#x?\d+|[0-9A-Za-z]+);/g, (html) => {
    option.innerHTML = html;
    return option.text;
  });
}
