# Cosmos IPTV

Smart TV IPTV player with spatial navigation — works with TV remote, gamepad, and keyboard.

**Targets:** web (PWA), Android (Capacitor), iOS (Capacitor)

## Features

- **M3U playlist support** — load channels from any M3U URL
- **EPG** — programme guide with mock data (real XMLTV integration ready)
- **Favourites** — persisted to localStorage
- **Spatial navigation** — react-tv-space-navigation for TV remote / gamepad / keyboard
- **HLS support** — hls.js for .m3u8 streams; native playback fallback
- **PWA** — installable on smart TVs and mobile devices
- **Dark theme** — designed for living-room viewing

## Quick start (web)

```bash
git clone https://github.com/xbrand/cosmos-iptv.git
cd cosmos-iptv
npm install
npm run dev          # dev server at http://localhost:3000
npm run build        # production build → dist/
```

## Native builds

### Android

Requirements: [Android Studio](https://developer.android.com/studio) with Android SDK, JDK 17+.

```bash
npm run build                    # build web app
npx cap sync android             # sync to Android project
npx cap open android             # open in Android Studio
```

Or from Android Studio: open the `android/` folder, connect a device/emulator, and run.

### iOS

Requirements: macOS with Xcode.

```bash
npm run build
npx cap sync ios
npx cap open ios                 # opens in Xcode
```

Then build and run from Xcode.

### Running on a Smart TV

**webOS / Android TV:**
- Serve the `dist/` folder from any static host (nginx, GitHub Pages, Vercel, Netlify)
- Or sideload the APK (Android) or IPK (webOS) package

**Tizen (Samsung):**
- Package the `dist/` folder as a Tizen web app using Tizen Studio

## Project structure

```
cosmos-iptv/
├── src/
│   ├── App.tsx                  # root layout + sidebar nav
│   ├── main.tsx                 # entry point
│   ├── index.css                # global dark theme styles
│   ├── types/index.ts           # TypeScript types
│   ├── store/index.ts           # Zustand stores (channel, favourites, settings, UI)
│   ├── services/m3u.ts          # M3U playlist parser
│   ├── hooks/
│   │   └── useSpatialNavigation.ts  # remote/keyboard config
│   ├── components/
│   │   └── VideoPlayer.tsx      # HLS + direct stream player
│   └── screens/
│       ├── ChannelsScreen.tsx    # channel grid with group filter
│       ├── FavouritesScreen.tsx # starred channels
│       ├── EPGScreen.tsx        # programme guide
│       └── SettingsScreen.tsx   # M3U/EPG URL config
├── public/
│   └── manifest.json            # PWA manifest
├── android/                    # Capacitor Android project
├── ios/                        # Capacitor iOS project
├── capacitor.config.ts
├── vite.config.ts
└── tsconfig.json
```

## Navigation

| Input | Controls |
|---|---|
| Keyboard | Arrow keys = navigate, Enter = select |
| TV remote | D-pad = navigate, OK = select, Back = back |
| Mouse/pointer | Click to select, hover for focus ring |
| Gamepad | Left stick / D-pad = navigate, A = select |

## Configuration

In **Settings**, enter:
- **M3U Playlist URL** — your IPTV provider's M3U endpoint
- **EPG URL** — XMLTV file URL (optional; EPG is populated with mock data by default)

Favourites and settings persist to localStorage.
