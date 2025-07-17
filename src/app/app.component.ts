import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
	IonHeader,
	IonTitle,
	IonToolbar,
	IonContent,
	IonButton,
	IonRouterOutlet,
	IonApp,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { User } from './models/user.model';

@Component({
	selector: 'app-root',
	imports: [
		IonApp,
		IonRouterOutlet,
		IonButton,
		IonContent,
		IonToolbar,
		IonTitle,
		IonHeader,
		RouterOutlet,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
	title = 'krokodili-fe';

	constructor(private router: Router) {
		addIcons({ sunnyOutline, moonOutline });
	}

	async ngOnInit(): Promise<any> {
		User.bumpVisitDate();
	}
}
