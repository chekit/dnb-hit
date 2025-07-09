import { togglePlayStateImage } from './ui';

// @REFACTOR: STate should be immutable
export const appState: { IS_PLAYING_NOW: boolean; CURRENT_SONG: null | string; } = {
  IS_PLAYING_NOW: false,
  CURRENT_SONG: null
}

export function togglePlayState() {
  appState.IS_PLAYING_NOW = !appState.IS_PLAYING_NOW;
  togglePlayStateImage(appState.IS_PLAYING_NOW ? 'flex' : 'none')
}

