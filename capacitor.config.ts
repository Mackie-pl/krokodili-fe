import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.purrfectcode.krokodili',
  appName: 'Krokodili',
  webDir: 'dist/krokodili-fe/browser',
  server: {
    url: 'https://cb0a-85-221-138-44.ngrok-free.app',
    cleartext: true,
  },
};

export default config;
