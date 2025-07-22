import { Routes } from '@angular/router';
import { NormalScreenGuard } from './shared/guards/normal-screen.guard';
import { WelcomeScreenGuard } from './shared/guards/welcome-screen.guard';

export const routes: Routes = [
	{
		path: 'welcome',
		loadComponent: () =>
			import('./welcome/welcome.component').then(
				(m) => m.WelcomeComponent
			),
		canActivate: [WelcomeScreenGuard],
	},
	{
		path: 'main',
		loadComponent: () =>
			import('./main/main.component').then((m) => m.MainComponent),
		canActivate: [NormalScreenGuard],
	},
	{
		path: 'digest/:id',
		loadComponent: () =>
			import('./digest/digest.component').then((m) => m.DigestComponent),
		canActivate: [NormalScreenGuard],
	},
	{
		path: 'login',
		loadComponent: () =>
			import('./log-in/log-in.component').then((m) => m.LogInComponent),
		canActivate: [WelcomeScreenGuard],
	},
	{
		path: '',
		redirectTo: 'welcome',
		pathMatch: 'full',
	},
];
