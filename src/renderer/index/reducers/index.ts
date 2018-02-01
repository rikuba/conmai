import { combineReducers } from 'redux';

import preferences, { Preferences } from './preferences';
import threads, { Threads } from './threads';
import { Thread } from './thread';
import posts, { Posts, Post } from './posts';
import ui, { UI } from './ui';
import pages, { Pages } from './pages';
import { Page } from './page';

export { Preferences, Posts, Post, Thread, Pages, Page };

export interface State {
  preferences: Preferences;
  threads: Threads;
  posts: Posts;
  ui: UI;
  pages: Pages;
}

export default combineReducers<State>({
  preferences,
  threads,
  posts,
  ui,
  pages,
});
