import {
	ApplicationConfig,
	provideZoneChangeDetection,
	APP_INITIALIZER,
	importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import Parse from 'parse';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage-angular';

// Function to initialize Parse
function initializeParse() {
	return () => {
		// Initialize with Back4app keys
		Parse.initialize(
			environment.PARSE_APP_ID,
			environment.PARSE_JAVASCRIPT_KEY
		);
		Parse.serverURL = 'https://parseapi.back4app.com';
		console.log('Parse has been initialized');
	};
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		importProvidersFrom(IonicStorageModule.forRoot()),
		provideIonicAngular({}),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeParse,
			multi: true,
		},
	],
};
