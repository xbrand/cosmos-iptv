import { SpatialNavigation, Directions } from 'react-tv-space-navigation';

type SpatialDir = 'up' | 'down' | 'left' | 'right' | 'enter';

// Map spatial direction strings to Directions enum values (used as config values)
const SPATIAL_MAP: Record<SpatialDir, string> = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
  enter: 'enter',
};

// ─── Back-button handler (separate from spatial navigation) ───────────────────
type BackHandler = () => void;
let globalBackHandler: BackHandler | null = null;

export function setGlobalBackHandler(fn: BackHandler) {
  globalBackHandler = fn;
}

/**
 * Configure all input sources for react-tv-space-navigation.
 * Supports: keyboard, gamepad, and native TV remote (via cosmos:remote CustomEvent).
 *
 * Native remote events are dispatched from Android MainActivity.dispatchKeyEvent()
 * as: window.dispatchEvent(new CustomEvent('cosmos:remote', { detail: 'up' }))
 */
export function configureSpatialNavigation(): () => void {
  // Keyboard + gamepad
  SpatialNavigation.configureRemoteControl({
    remoteControlSubscriber: (callback) => {
      const keyMap: Record<string, string> = {
        ArrowRight: 'right',
        ArrowLeft: 'left',
        ArrowUp: 'up',
        ArrowDown: 'down',
        Enter: 'enter',
        // Gamepad
        MediaPlay: 'enter',
        MediaSelect: 'enter',
      };

      const handler = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        const dir = keyMap[e.key];
        if (dir !== undefined) {
          e.preventDefault();
          callback(dir as any);
        }
      };

      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    },
    remoteControlUnsubscriber: (id) => {
      if (typeof id === 'function') id();
    },
  });

  // Native TV remote (Android TV / webOS via Capacitor WebView bridge)
  // Dispatches synthetic keyboard events to integrate with the configured subscriber above
  const remoteHandler = (e: Event) => {
    const dir = (e as CustomEvent<SpatialDir | 'back'>).detail;
    if (dir === 'back') {
      if (globalBackHandler) globalBackHandler();
      return;
    }

    // Map remote direction → KeyboardEvent key
    const keyMap: Record<SpatialDir, string> = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      enter: 'Enter',
    };

    const key = keyMap[dir as SpatialDir];
    if (key) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
  };
  window.addEventListener('cosmos:remote', remoteHandler);

  return () => {
    window.removeEventListener('cosmos:remote', remoteHandler);
  };
}
