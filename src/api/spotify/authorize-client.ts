export function authorizeClient() {
  const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
  ];
  const CLIENT_ID = '080aff05f66649f194c9851f0b640de7';
  const { location } = window;
  const redirect_uri = `${location.origin}${location.pathname}`;
  // @TODO: update to use CODE response_type as described here https://developer.spotify.com/documentation/web-api/tutorials/code-flow
  const url = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&scope=${SCOPES.join(
    ' '
  )}&redirect_uri=${redirect_uri}`;

  location.href = url;
}
