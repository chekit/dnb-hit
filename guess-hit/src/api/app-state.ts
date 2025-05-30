import { UI } from './ui';

export const appState: { IS_PLAYING_NOW: boolean; CURRENT_SONG: null | string; } = {
  IS_PLAYING_NOW: false,
  CURRENT_SONG: null
}

export function togglePlayState() {
  appState.IS_PLAYING_NOW = !appState.IS_PLAYING_NOW;
  UI.PLAY_STATE_IMAGE!.style.display = appState.IS_PLAYING_NOW ? 'flex' : 'none';
}