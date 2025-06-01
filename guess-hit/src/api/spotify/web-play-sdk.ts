export async function searchTrackById(trackId: string, token: string) {
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
export async function startPlayback({
  album_uri: context_uri,
  track_number: position,
  device_id,
  token,
}: { album_uri: string; track_number: number; device_id: string; token: string; }) {
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
export async function getActiveDevice(token: string) {
  const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const [active] = data.devices.filter((d: any) => d.is_active);
  return active;
}