import { Action } from '../actions';

export interface ThreadWaits {
  [url: string]: number;
}

export default function threadWaits(state: ThreadWaits = {}, action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_OPEN':
    case 'THREAD_UPDATE_SCHEDULE':
    case 'THREAD_UPDATE_SCHEDULE_CANCEL':
      return {
        ...state,
        [action.url]: 0,
      };
      
    case 'THREAD_UPDATE_WAIT_TICK':
      return {
        ...state,
        [action.url]: state[action.url] + 1,
      };

    default:
      return state;
  }
}
