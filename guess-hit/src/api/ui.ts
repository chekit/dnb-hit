const UI = {
  get PLAY_STATE_IMAGE() {
    return document.getElementById('play-state');
  },
  get SCANNED_STATUS() { return document.getElementById('scanned-message') },
  get PLAY_PAUSE_BTN() { return document.getElementById('toggle_play') },
  get SCANNER_BTN() { return document.getElementById('scan_qr') },
  get SCANNER_READER() { return document.getElementById('reader') },
  get CLOSE_SCANNER_READER() { return document.getElementById('close-reader') }
}

export { UI };
