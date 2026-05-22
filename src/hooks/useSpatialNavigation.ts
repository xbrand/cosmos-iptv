import { SpatialNavigation, Directions } from 'react-tv-space-navigation';

/**
 * Configure all input sources for react-tv-space-navigation.
 * Called once at app startup.
 */
export function configureSpatialNavigation(): void {
  SpatialNavigation.configureRemoteControl({
    remoteControlSubscriber: (callback) => {
      const keyMap: Record<string, Directions> = {
        ArrowRight: Directions.RIGHT,
        ArrowLeft: Directions.LEFT,
        ArrowUp: Directions.UP,
        ArrowDown: Directions.DOWN,
        Enter: Directions.ENTER,
        // FireTV / Android TV gamepad
        MediaPlay: Directions.ENTER,
        MediaSelect: Directions.ENTER,
      };

      const handler = (e: KeyboardEvent) => {
        const dir = keyMap[e.key];
        if (dir !== undefined) {
          e.preventDefault();
          callback(dir);
        }
      };

      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    },

    remoteControlUnsubscriber: (id) => {
      if (typeof id === 'function') id();
    },
  });
}
