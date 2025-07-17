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
import { APP_BASE_HREF } from '@angular/common';
import { Device } from '@capacitor/device';

// Function to initialize Parse
function initializeParse() {
	return () => {
		// Initialize with Back4app keys
		Parse.initialize(
			environment.PARSE_APP_ID,
			environment.PARSE_JAVASCRIPT_KEY
		);
		Parse.serverURL = 'https://krokodili.b4a.io';
		Image.Initialize();
		Language.Initialize();
		initializeInstallation();
	};
}

async function initializeInstallation() {
	const deviceInfo = await Device.getInfo();
	if (deviceInfo.platform === 'android') {
		Parse.Installation.DEVICE_TYPES.WEB = 'android';
	}
	const installation = await Parse.Installation.currentInstallation();
	await installation.save();
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
		{
			provide: APP_BASE_HREF,
			useValue: '/app/',
		},
	],
};
// https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https://krokodili.b4a.io/redirect&client_id=711422987291-sjbjg768714fp9pt6ec1krq6b8h9rfjg.apps.googleusercontent.com

// https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https%3A%2F%2Fkrokodili.b4a.io%2Fredirect&client_id=711422987291-sjbjg768714fp9pt6ec1krq6b8h9rfjg.apps.googleusercontent.com
