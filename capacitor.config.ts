import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Animated login avatar',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: 'none'
    }
  }
};

export default config;
