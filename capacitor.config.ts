import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.wenxuji',
  appName: '文须记',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'LIGHT', // 深色文字，适合浅色背景
      backgroundColor: '#ffffff', // 白色背景
      overlaysWebView: false, // 不覆盖 WebView
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
  },
};

export default config;
