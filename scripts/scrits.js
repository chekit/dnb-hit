// Globals
let CURRENT_SONG;
let PLAYER;
let IS_PLAYING_NOW = false;

// UI
const PLAY_STATE_IMAGE = document.getElementById('play-state');
const SCANNED_STATUS = document.getElementById('scanned-message');
const PLAY_PAUSE_BTN = document.getElementById('toggle_play');
const SCANNER_BTN = document.getElementById('scan_qr');

window.onSpotifyWebPlaybackSDKReady = async () => {
  const token = getToken();

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

      if (CURRENT_SONG && !IS_PLAYING_NOW) {
        const { album_uri, track_number } = await searchTrackById(
          CURRENT_SONG,
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

function authorizeClient() {
  const scope = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
  ];
  const CLIENT_ID = '080aff05f66649f194c9851f0b640de7';
  const redirect_uri = window.location.origin + window.location.pathname;

  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${scope.join(
    ' '
  )}&redirect_uri=${redirect_uri}`;

  window.location = url;
}

async function searchTrackById(trackId, token) {
  const request = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}?market=EU`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await request.json();

  return {
    album_uri: data.album.uri,
    track_number: data.track_number - 1,
  };
}

/**
 * Source: https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback
 */
async function startPlayback({
  album_uri: context_uri,
  track_number: position,
  device_id,
  token,
}) {
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri,
        offset: {
          position,
        },
      }),
    }
  );
}

/**
 * Source: https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices
 */
async function getActiveDevice(token) {
  const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const [active] = data.devices.filter((d) => d.is_active);
  return active;
}

async function initQRScanner() {
  const devices = await Html5Qrcode.getCameras();
  const [backCamera] = devices.filter((d) =>
    d.label.toLowerCase().match(/back/gim)
  );
  const { id: cameraId } = backCamera ?? devices[0];

  const html5QrCode = new Html5Qrcode('reader');

  await html5QrCode.start(
    cameraId,
    {
      fps: 10,
      qrbox: 250,
    },
    onScanSuccess
  );

  async function onScanSuccess(decodedText) {
    await html5QrCode.stop();
    CURRENT_SONG = decodedText;

    SCANNED_STATUS.style.display = 'block';
    PLAY_PAUSE_BTN.style.display = 'block';

    if (IS_PLAYING_NOW) {
      await PLAYER.togglePlay();
      togglePlayState();
    }
    html5QrCode.clear();
  }
}

function togglePlayState() {
  IS_PLAYING_NOW = !IS_PLAYING_NOW;
  PLAY_STATE_IMAGE.style.display = IS_PLAYING_NOW ? 'block' : 'none';
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function getToken() {
  const { access_token } = history.state;

  if (!access_token) {
    throw new Error('Access Token not defined!');
  }

  return access_token;
}

async function init() {
  try {
    if (!location.hash.substring(1)) {
      return authorizeClient();
    } else {
      const access_token = new URLSearchParams(location.hash.substring(1)).get(
        'access_token'
      );
      window.history.pushState({ access_token }, '', window.location.pathname);
    }
  } catch (e) {
    console.error('[APP ERROR]', e);
  }
}

(async () => {
  await init();
})();
