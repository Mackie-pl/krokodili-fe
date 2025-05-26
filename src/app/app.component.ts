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
import { AnonymousUtils } from 'parse';

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
		// const loggedInUser = User.current() as User;
		// console.log(loggedInUser);
		// if (!loggedInUser) return this.router.navigate(['/welcome']);
		// const subscriptions = await loggedInUser.getSubscriptions();
		// console.log(subscriptions);
		// if (subscriptions.length === 0)
		// 	return this.router.navigate(['/welcome']);
		// this.router.navigate(['/main']);
		// we do the same as below, just better
		// const user = await AnonymousUtils.logIn();
	}
}
