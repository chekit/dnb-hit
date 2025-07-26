import { togglePlayStateImage } from './ui';

let appState: {
  IS_PLAYING_NOW: boolean;
  CURRENT_SONG: null | string;
} = {
  IS_PLAYING_NOW: false,
  CURRENT_SONG: null,
};

export function state() {
  return appState;
}

export function togglePlayState() {
  appState = {
    ...appState,
    IS_PLAYING_NOW: !appState.IS_PLAYING_NOW,
  };

  togglePlayStateImage(appState.IS_PLAYING_NOW ? 'flex' : 'none');
}

export function updateCurrentSong(song: string) {
  appState = {
    ...appState,
    CURRENT_SONG: song,
  };
}

export function resetCurrentSong() {
  appState = {
    ...appState,
    CURRENT_SONG: null,
  };
}
