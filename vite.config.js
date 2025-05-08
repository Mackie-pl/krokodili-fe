import { defineConfig } from 'vite';
import angular from '@angular-devkit/build-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    // Allow the ngrok host and/or wildcard subdomains
    allowedHosts: [
      'https://cb0a-85-221-138-44.ngrok-free.app',
      'cb0a-85-221-138-44.ngrok-free.app', // Exact host
      '.ngrok-free.app' // Wildcard for all ngrok subdomains
    ]
  }
});
