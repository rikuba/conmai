import React from 'react';
import ReactDOM from 'react-dom';

import PostsComponent from '../posts/posts';
import { Thread } from '../../reducers';

import './thread.css';

type Props = Thread & OwnProps;

interface OwnProps {
  isSelected: boolean;
}

export default class ThreadComponent extends React.PureComponent<Props, any> {
  private lastNewPostNumber = 0;
  private isScrolledToTheEnd = true;

  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('scroll', this.handleScroll, { passive: true } as any);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('scroll', this.handleScroll, { passive: true } as any);
  }

  componentDidUpdate() {
    const { newPostNumber } = this.props;
    if (newPostNumber !== this.lastNewPostNumber) {
      if (newPostNumber > 1 && this.isScrolledToTheEnd) {
        this.scrollToNewPost();
      }
      this.lastNewPostNumber = newPostNumber;
    }
  }

  scrollToNewPost() {
    const elm = ReactDOM.findDOMNode(this);
    elm.scrollTop = elm.scrollHeight - elm.clientHeight;
  }

  handleScroll = (e: any) => {
    const elm: HTMLDivElement = e.currentTarget;
    this.isScrolledToTheEnd = elm.scrollTop >= elm.scrollHeight - elm.clientHeight - 10;
  };

  render() {
    const { posts, newPostNumber, isSelected } = this.props;
    const isNew = (number: number) => number >= newPostNumber;

    return (
      <div className="thread" data-is-selected={isSelected}>
        <PostsComponent posts={posts} newPostNumber={newPostNumber} />
      </div>
    );
  }
}
