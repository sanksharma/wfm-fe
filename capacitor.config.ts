import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wholefoodsmarket.app',
  appName: 'WFM Task Manager',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // url: 'http://localhost:8080/',
    //   cleartext: true
  }
};

export default config;
