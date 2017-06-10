import { combineReducers } from 'redux';

import preferences, { Preferences } from './preferences';
import threads, { Threads } from './threads';
import { Thread } from './thread';
import posts, { Posts, Post } from './posts';
import ui, { UI } from './ui';

export {
  Preferences,
  Posts,
  Post,
  Thread,
};

export interface State {
  preferences: Preferences;
  threads: Threads;
  posts: Posts;
  ui: UI;
}

export default combineReducers<State>({
  preferences,
  threads,
  posts,
  ui,
});
