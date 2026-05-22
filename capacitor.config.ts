import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cosmos.iptv',
  appName: 'Cosmos IPTV',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#0a0a1a',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    backgroundColor: '#0a0a1a',
    allowsLinkPreview: false,
    contentInset: 'automatic',
  },
};

export default config;
