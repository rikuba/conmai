import { combineReducers } from 'redux';

import preferences, { Preferences } from './preferences';
import threads, { Threads } from './threads';
import { Thread } from './thread';
import threadWaits, { ThreadWaits } from './thread-waits';
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
  threadWaits: ThreadWaits;
  posts: Posts;
  ui: UI;
}

export default combineReducers<State>({
  preferences,
  threads,
  threadWaits,
  posts,
  ui,
});
