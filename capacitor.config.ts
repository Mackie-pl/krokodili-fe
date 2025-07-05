import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.purrfectcode.krokodili',
	appName: 'Krokodili',
	webDir: 'dist/krokodili-fe/browser',
	server: {
		// url: 'https://marmoset-splendid-jay.ngrok-free.app',
		url: 'http://192.168.50.59:8100/app',
		cleartext: true,
	},
};

export default config;
