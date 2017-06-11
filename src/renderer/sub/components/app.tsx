import React from 'react';

import MyComment from './my-comment';
import PostComment from './post-comment';

export default class App extends React.Component<{}, {}> {
  handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;
    
    if (target.matches('a, a *')) {
      e.preventDefault();
    }
  };

  render() {
    return (
      <div className="sub-page"
        onClick={this.handleClick}>
        <MyComment />
        <PostComment />
      </div>
    );
  }
}
