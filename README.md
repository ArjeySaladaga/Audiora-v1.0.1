# Audiora

Audiora is an offline desktop music player built with Electron, HTML, CSS, and vanilla JavaScript. It scans local audio files, maintains a searchable playlist, plays tracks through an HTML audio element, and provides playback, visualization, EQ, theme, and custom window controls.

## Features

- Add individual audio files or scan a folder recursively, up to four directory levels deep.
- Drag and drop supported audio files onto the application window.
- Play, pause, next, previous, rewind 10 seconds, shuffle, and repeat modes (`off`, `all`, and `one`).
- Seek and volume sliders with live time displays.
- Live frequency visualizer using the Web Audio API.
- Audio EQ settings with `Flat`, `Classical`, `Club`, and `Custom` profiles.
- EQ On/Off bypass control and Bass, Mid, and Treble gain sliders.
- Search filtering with a clear-search button.
- Click the album artwork to hide or restore it with animation.
- Default, Dark, Light, and Custom background themes.
- Upload custom theme images and select them from the theme panel.
- Frameless window with HTML/CSS titlebar, drag region, minimize, maximize, and close controls.
- Playlist, volume, shuffle, repeat, EQ, and theme settings persist in renderer `localStorage`.

Supported formats are MP3, WAV, OGG, M4A, FLAC, AAC, and OPUS, subject to the Chromium audio codecs available in the installed Electron build.

## Requirements

- Node.js and npm
- An Electron-compatible desktop environment

## Getting started

```bash
npm install
npm start
```

## Build a distributable

```bash
npm run dist
```

Packaging is handled by `electron-builder`. The current configuration targets NSIS on Windows, DMG on macOS, and AppImage on Linux, with platform icons from `assets/`.

## Project structure

```text
Audiora/
├── main.js                 # Electron main process and filesystem dialogs
├── preload.js              # Context-isolated renderer bridge
├── package.json            # Scripts, dependencies, and builder settings
├── package-lock.json       # Locked npm dependency tree
├── assets/                 # Windows, macOS, and Linux application icons
├── src/
│   ├── index.html          # Application markup and controls
│   ├── css/styles.css      # Layout, themes, animations, and responsive styling
│   └── js/renderer.js      # Playlist, playback, audio graph, settings, and UI events
├── process/                # Generated project process documentation
└── README.md
```

`node_modules/` contains installed dependencies and `dist/` contains generated packaging output; neither is required as application source.

## How it works

1. `main.js` creates a frameless `BrowserWindow` and loads `src/index.html`.
2. `preload.js` exposes a small `window.audiora` API for file/folder dialogs and window controls.
3. `renderer.js` builds track metadata, stores the playlist, filters visible tracks, and controls the `<audio>` element.
4. Selecting a track sets its local `file://` URL on the audio element. Playback events update the controls, artwork animation, playlist row, and visualizer.
5. On first playback, the renderer creates a Web Audio graph containing Bass, Mid, and Treble biquad filters followed by an analyser. EQ settings alter the filter gains; EQ Off sets all gains to `0 dB`.
6. Theme and player preferences are serialized under `audiora:state:v1` in `localStorage`.

## Filename metadata

Files named `Artist - Title.ext` are displayed with the split artist and title. Files without that separator use the filename as the title and `Unknown Artist` as the artist.

## Keyboard shortcuts

- `Space`: play or pause
- `Left Arrow` / `Right Arrow`: seek backward or forward five seconds
- `Up Arrow` / `Down Arrow`: increase or decrease volume by five percent

## Security and limitations

The renderer uses `contextIsolation: true` and `nodeIntegration: false`; filesystem access is kept in the main process and exposed through preload IPC methods. The BrowserWindow currently uses `sandbox: false` because of the existing Electron setup. Custom background images are stored as data URLs in `localStorage`, so browser storage limits apply. There is currently no automated test script in `package.json`; validation is typically done with `node --check` and manual Electron testing.
