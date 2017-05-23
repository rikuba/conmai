import { combineReducers } from 'redux';

import { Post } from '../../clients/shitaraba-client';
import preferences, { Preferences } from './preferences';
import threads, { Threads } from './threads';
import { Thread } from './thread';
import ui, { UI } from './ui';

export {
  Preferences,
  Post,
  Thread,
};

export interface State {
  preferences: Preferences;
  threads: Threads;
  ui: UI;
}

export default combineReducers<State>({
  preferences,
  threads,
  ui,
});
