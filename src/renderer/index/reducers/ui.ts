import { combineReducers } from 'redux';

import { Action } from '../actions';

export interface UI {
  subWindowIsOpen: boolean;
}

function subWindowIsOpen(state = false, action: Action): typeof state {
  switch (action.type) {
    case 'SUB_WINDOW_OPEN':
      return true;

    case 'SUB_WINDOW_CLOSED':
      return false;

    default:
      return state;
  }
}

export default combineReducers<UI>({
  subWindowIsOpen,
});
