import React from 'react';
import ReactDOM from 'react-dom';

import PostComponent from '../post/post';
import { Thread } from '../../reducers';

import './thread.css';

export default class ThreadComponent extends React.Component<Thread, any> {
  componentDidUpdate() {
    const elm = ReactDOM.findDOMNode(this);
    if (elm) {
      elm.scrollTop = elm.scrollHeight - elm.clientHeight;
    }
  }

  render() {
    const { posts } = this.props;

    return (
      <div className="thread">
        {posts.map((post) => (
          <PostComponent key={post.number} {...post} />
        ))}
      </div>
    );
  }
}
