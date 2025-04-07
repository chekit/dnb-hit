let CURRENT_ARTIST;
let IS_PLAYING_NOW = false;
const PLAY_STATE_IMAGE = document.getElementById('play-state');

window.onSpotifyWebPlaybackSDKReady = async () => {
  const params = new URLSearchParams(document.location.hash.substring(1));
  const token = params.get('access_token');

  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  // Ready
  player.addListener('ready', async ({ device_id }) => {
    console.log('Ready with Device ID');

    const btn = document.getElementById('scanner');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();

      initQRScanner();
    });

    const toggle = document.getElementById('toggle_play');
    toggle.addEventListener('click', async (e) => {
      e.preventDefault();

      if (CURRENT_ARTIST && !IS_PLAYING_NOW) {
        const [top] = await getArtistTopTracks(CURRENT_ARTIST, token);
        await startPlayback(
          top.album.uri,
          top.track_number - 1,
          device_id,
          token
        );

        if (isIOS()) {
          await player.togglePlay();
        }
        togglePlayState();
      } else {
        await player.togglePlay();
        togglePlayState();
      }
    });
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  player.addListener('initialization_error', ({ message }) => {
    console.error(message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });

  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });

  player.addListener(
    'player_state_changed',
    ({ position, duration, track_window: { current_track } }) => {
      console.log('Currently Playing', current_track);
      console.log('Position in Song', position);
      console.log('Duration of Song', duration);
    }
  );

  player.connect();
};

function authorizeClient() {
  const scope = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
  ];
  const redirect_uri = window.location.origin + window.location.pathname;
  const CLIENT_ID = '080aff05f66649f194c9851f0b640de7';

  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${scope.join(
    ' '
  )}&redirect_uri=${redirect_uri}`;

  window.location = url;
}

async function getArtistTopTracks(artistId, token) {
  const request = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await request.json();

  return data.tracks;
}

async function startPlayback(albumId, trackNumber, device_id, token) {
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: albumId,
        offset: {
          position: trackNumber,
        },
        // position_ms: 0,
      }),
    }
  );
}

async function stopPlayback(device_id, token) {
  await fetch(
    `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

function initQRScanner() {
  const html5QrcodeScanner = new Html5QrcodeScanner('reader', {
    fps: 10,
    qrbox: 250,
  });
  html5QrcodeScanner.render(onScanSuccess);

  function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    CURRENT_ARTIST = decodedText;
    html5QrcodeScanner.clear();
  }
}

function togglePlayState() {
  IS_PLAYING_NOW = !IS_PLAYING_NOW;
  PLAY_STATE_IMAGE.style.display = IS_PLAYING_NOW ? 'block' : 'none';
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

async function init() {
  try {
    if (!location.hash.substring(1)) {
      return authorizeClient();
    }
  } catch (e) {
    console.error('[APP ERROR]', e);
  }
}

(async (global) => {
  await init();
})(window);
