import { State } from '../reducers';

export * from './page';

export const getUpdateIntervalPreference = (state: State) => state.preferences.updateInterval;
