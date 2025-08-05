import { state, togglePlayState } from '../app-state';
import { getToken } from '../helpers/get-token';
import { isIOS } from '../helpers/is-ios';
import { initQRScanner } from '../scanner/init-qrscanner';
import { UI, toggleScannedStatus } from '../ui';
import { searchTrackById, startPlayback } from './web-play-sdk';

type SPOTIFY_PLAYER = {
  addListener: (...args: any) => void;
  togglePlay: VoidFunction;
  connect: VoidFunction;
};

let PLAYER: SPOTIFY_PLAYER;

const initPlayer = function () {
  // @ts-expect-error: Global Spotify window object
  window.onSpotifyWebPlaybackSDKReady = async () => {
    const token = getToken();

    // @ts-expect-error: Global Spotify object
    PLAYER = new Spotify.Player({
      name: 'Web Playback SDK Guess Hit Player',
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token);
      },
      volume: 0.5,
    });

    // Ready
    PLAYER.addListener(
      'ready',
      async ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);

        UI.SCANNER_BTN!.addEventListener('click', async (e) => {
          e.preventDefault();

          initQRScanner();
        });

        UI.PLAY_PAUSE_BTN!.addEventListener('click', async (e) => {
          e.preventDefault();

          toggleScannedStatus('none');

          if (state().CURRENT_SONG && !state().IS_PLAYING_NOW) {
            const { album_uri, track_number } = await searchTrackById(
              state().CURRENT_SONG!,
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
      }
    );

    // Not Ready
    PLAYER.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    PLAYER.addListener(
      'initialization_error',
      ({ message }: { message: string }) => {
        console.error(message);
      }
    );

    PLAYER.addListener(
      'authentication_error',
      ({ message }: { message: string }) => {
        console.error(message);
      }
    );

    PLAYER.addListener('account_error', ({ message }: { message: string }) => {
      console.error(message);
    });

    PLAYER.addListener(
      'player_state_changed',
      ({
        position,
        duration,
        track_window: { current_track },
      }: {
        position: number;
        duration: number;
        track_window: { current_track: string };
      }) => {
        console.log('Currently Playing', current_track);
        console.log('Position in Song', position);
        console.log('Duration of Song', duration);
      }
    );

    PLAYER.connect();
  };
};

export { PLAYER, initPlayer };
