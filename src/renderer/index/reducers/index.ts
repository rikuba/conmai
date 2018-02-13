import { combineReducers } from 'redux';

import preferences, { Preferences } from './preferences';
import ui, { UI } from './ui';
import pages, { Pages } from './pages';
import { Page } from './page';

export { Preferences, Pages, Page };

export interface State {
  preferences: Preferences;
  ui: UI;
  pages: Pages;
}

export default combineReducers<State>({
  preferences,
  ui,
  pages,
});
