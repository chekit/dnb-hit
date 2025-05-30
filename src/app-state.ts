import { PLAY_STATE_IMAGE } from './ui';

export const appState = {
  IS_PLAYING_NOW: false,
  CURRENT_SONG: null
}

export function togglePlayState() {
  appState.IS_PLAYING_NOW = !appState.IS_PLAYING_NOW;
  PLAY_STATE_IMAGE!.style.display = appState.IS_PLAYING_NOW ? 'block' : 'none';
}