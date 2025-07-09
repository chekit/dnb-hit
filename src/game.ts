import { authorizeClient } from './api/spotify/authorize-client';
import { initPlayer } from "./api/spotify/init-player";

export async function init() {
  try {
    if (!location.hash.substring(1)) {
      return authorizeClient();
    } else {
      const access_token = new URLSearchParams(location.hash.substring(1)).get(
        'access_token'
      );
      window.history.pushState({ access_token }, '', window.location.pathname);
      initPlayer();
    }
  } catch (e) {
    console.error('[APP ERROR]', e);
  }
}