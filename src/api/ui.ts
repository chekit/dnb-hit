const UI = {
  get PLAY_STATE_IMAGE() {
    return document.getElementById('play-state');
  },
  get SCANNED_STATUS() {
    return document.getElementById('scanned-message');
  },
  get PLAY_PAUSE_BTN() {
    return document.getElementById('toggle_play');
  },
  get SCANNER_BTN() {
    return document.getElementById('scan_qr');
  },
  get SCANNER_READER() {
    return document.getElementById('reader');
  },
  get CLOSE_SCANNER_READER() {
    return document.getElementById('close-reader');
  },
};

export function toggleScannedStatus(displaySetting: 'block' | 'none'): void {
  UI.SCANNED_STATUS!.style.display = displaySetting;
}

export function toggleCloseScannerButton(
  displaySetting: 'block' | 'none'
): void {
  UI.CLOSE_SCANNER_READER!.style.display = displaySetting;
}

export function togglePlayPauseButton(displaySetting: 'block' | 'none'): void {
  UI.PLAY_PAUSE_BTN!.style.display = displaySetting;
}

export function togglePlayStateImage(displaySetting: 'flex' | 'none'): void {
  UI.PLAY_STATE_IMAGE!.style.display = displaySetting;
}

export { UI };
