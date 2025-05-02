import { Html5Qrcode } from 'html5-qrcode';
import { appState, togglePlayState } from '../app-state';
import { PLAY_PAUSE_BTN, SCANNED_STATUS } from '../ui';
import { PLAYER } from '../api/init-player';

let CURRENT_SONG;


export async function initQRScanner() {
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
    onScanSuccess,
    () => console.error(`[ERROR] Error to initialize QR scanner`)
  );

  async function onScanSuccess(decodedText) {
    await html5QrCode.stop();
    CURRENT_SONG = decodedText;

    SCANNED_STATUS.style.display = 'block';
    PLAY_PAUSE_BTN.style.display = 'block';

    if (appState.IS_PLAYING_NOW) {
      await PLAYER.togglePlay();
      togglePlayState();
    }
    html5QrCode.clear();
  }
}
