import { appState, togglePlayState } from '../app-state';
import { getToken } from '../helpers/get-token';
import { isIOS } from '../helpers/is-ios';
import { initQRScanner } from '../scanner/init-qrscanner';
import { PLAY_PAUSE_BTN, SCANNED_STATUS, SCANNER_BTN } from '../ui';
import { searchTrackById, startPlayback } from './web-play-sdk';

let PLAYER: { addListener };

const initPlayer = function () {
  // @ts-ignore: Global Spotify window object
  window.onSpotifyWebPlaybackSDKReady = async () => {
    const token = getToken();

    // @ts-ignore: Global Spotify object
    PLAYER = new Spotify.Player({
      name: 'Web Playback SDK Guess Hit Player',
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    // Ready
    PLAYER.addListener('ready', async ({ device_id }) => {
      console.log('Ready with Device ID', device_id);

      SCANNER_BTN.addEventListener('click', async (e) => {
        e.preventDefault();

        initQRScanner();
      });

      PLAY_PAUSE_BTN.addEventListener('click', async (e) => {
        e.preventDefault();

        SCANNED_STATUS.style.display = 'none';

        if (appState.CURRENT_SONG && !appState.IS_PLAYING_NOW) {
          const { album_uri, track_number } = await searchTrackById(
            appState.CURRENT_SONG,
            token
          );
          await startPlayback({ album_uri, track_number, device_id, token });

          if (isIOS()) {
            await PLAYER.togglePlay();
          }
          togglePlayState();
        } else {
          await PLAYER.togglePlay();
          togglePlayState();
        }
      });
    });

    // Not Ready
    PLAYER.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    PLAYER.addListener('initialization_error', ({ message }) => {
      console.error(message);
    });

    PLAYER.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });

    PLAYER.addListener('account_error', ({ message }) => {
      console.error(message);
    });

    PLAYER.addListener(
      'player_state_changed',
      ({ position, duration, track_window: { current_track } }) => {
        console.log('Currently Playing', current_track);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
      }
    );

    PLAYER.connect();
  };
}

export { initPlayer, PLAYER };
