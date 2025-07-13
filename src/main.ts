import playPauseIcon from './assets/play-or-pause-icon.svg'
import qrCodeScanIcon from './assets/qrcode-scan-icon.svg'
import { init } from './game'
import './global.scss'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <div class="top-block">
      <h1>👾 Detect a track year 👾</h1>
      <div id="play-state" class="waveContainer">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        <div class="wave wave4"></div>
        <div class="wave wave5"></div>
        <div class="wave wave4"></div>
        <div class="wave wave3"></div>
      </div>
    </div>
    <div class="active-block">
      <button id="scan_qr" class="scan-qr-button">
        ${qrCodeScanIcon}
      </button>

      <div class="play-pause">
        <p id="scanned-message" class="play-pause__info">Ready to guess? Click Play/Pause</p>
        <button id="toggle_play" class="play-pause__button" style="display: none">
          ${playPauseIcon}
        </button>
      </div>
    </div>
  </main>
  <div id="reader"></div>
  <button id="close-reader">X</button>
`

init()
