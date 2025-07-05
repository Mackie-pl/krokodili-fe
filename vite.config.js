import { defineConfig } from 'vite';
import angular from '@angular-devkit/build-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    // Allow the ngrok host and/or wildcard subdomains
    allowedHosts: [
      'https://cb0a-85-221-138-44.ngrok-free.app',
	  'https://marmoset-splendid-jay.ngrok-free.app',
      'cb0a-85-221-138-44.ngrok-free.app', // Exact host
      '192.168.50.59',
      '.ngrok-free.app' // Wildcard for all ngrok subdomains
    ]
  }
});
