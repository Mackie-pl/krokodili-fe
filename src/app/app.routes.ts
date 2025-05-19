import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'welcome',
		loadComponent: () =>
			import('./welcome/welcome.component').then(
				(m) => m.WelcomeComponent
			),
		// children: [
		// 	{
		// 		path: '',
		// 		redirectTo: 'lang-selection',
		// 		pathMatch: 'full',
		// 	},
		// 	{
		// 		path: 'lang-selection',
		// 		loadComponent: () =>
		// 			import(
		// 				'./welcome/lang-selection/lang-selection.component'
		// 			).then((m) => m.LangSelectionComponent),
		// 	},
		// 	{
		// 		path: 'level-selection',
		// 		loadComponent: () =>
		// 			import(
		// 				'./welcome/level-selection/level-selection.component'
		// 			).then((m) => m.LevelSelectionComponent),
		// 	},
		// ],
	},
	{
		path: 'main',
		loadComponent: () =>
			import('./main/main.component').then((m) => m.MainComponent),
	},
];
