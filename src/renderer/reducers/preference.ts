import { combineReducers } from 'redux';

import { Action } from '../actions';

export interface Preference {
  updateInterval: number;
}

function updateInterval(state: number = 10, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({
  updateInterval,
});
