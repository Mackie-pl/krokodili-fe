import {
	ApplicationConfig,
	provideZoneChangeDetection,
	APP_INITIALIZER,
	importProvidersFrom,
} from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import Parse from 'parse';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Image } from './models/image.model';
import { provideMarkdown } from 'ngx-markdown';
import { MARKED_OPTIONS } from 'ngx-markdown';
import { markedOptionsFactory } from './digest/custom-renderer';
import { Language } from './models/language.model';

// Function to initialize Parse
function initializeParse() {
	return () => {
		// Initialize with Back4app keys
		Parse.initialize(
			environment.PARSE_APP_ID,
			environment.PARSE_JAVASCRIPT_KEY
		);
		Parse.serverURL = 'https://parseapi.back4app.com';
		Image.Initialize();
		Language.Initialize();
	};
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withDebugTracing()),
		importProvidersFrom(IonicStorageModule.forRoot()),
		provideMarkdown({
			markedOptions: {
				provide: MARKED_OPTIONS,
				useFactory: markedOptionsFactory,
			},
		}),
		provideIonicAngular({}),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeParse,
			multi: true,
		},
	],
};
