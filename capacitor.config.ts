import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wholefoodsmarket.app',
  appName: 'whole-foods-market-poc-capacitor',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://192.168.1.36:5173',
    cleartext: true
  }
};

export default config;
