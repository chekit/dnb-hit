import { Html5Qrcode } from 'html5-qrcode';
import { state, togglePlayState, updateCurrentSong } from '../app-state';
import { PLAYER } from '../spotify/init-player';
import {
  UI,
  toggleCloseScannerButton,
  togglePlayPauseButton,
  toggleScannedStatus,
} from '../ui';

export async function initQRScanner() {
  const devices = await Html5Qrcode.getCameras();
  const [backCamera] = devices.filter((d) =>
    d.label.toLowerCase().match(/back/gim)
  );
  const { id: cameraId } = backCamera ?? devices[0];

  const html5QrCode = new Html5Qrcode('reader');

  UI.CLOSE_SCANNER_READER!.style.display = 'inline-block';

  await html5QrCode.start(
    cameraId,
    {
      fps: 10,
      qrbox: 250,
    },
    onScanSuccess,
    () => console.error(`[ERROR] Error to initialize QR scanner`)
  );

  async function onScanSuccess(decodedText: string) {
    await html5QrCode.stop();
    toggleCloseScannerButton('none');

    updateCurrentSong(decodedText);

    toggleScannedStatus('block');
    togglePlayPauseButton('block');

    if (state().IS_PLAYING_NOW) {
      await PLAYER.togglePlay();
      togglePlayState();
    }

    html5QrCode.clear();
  }

  UI.CLOSE_SCANNER_READER?.addEventListener('click', async () => {
    await html5QrCode.stop();
    toggleCloseScannerButton('none');
  });
}
