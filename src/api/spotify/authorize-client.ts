export function authorizeClient() {
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

  window.location.href = url;
}
