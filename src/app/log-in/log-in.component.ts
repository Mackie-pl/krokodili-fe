import { Component } from '@angular/core';
import { IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-log-in',
	templateUrl: './log-in.component.html',
	styleUrls: ['./log-in.component.scss'],
	imports: [IonGrid, IonRow, IonCol, IonButton],
})
export class LogInComponent {
	constructor(private router: Router) {}

	async logInWithGoogle() {
		const user = await User.getGoogleLoginUrl();
		const userSubscriptions = await user.getSubscriptions();
		if (userSubscriptions.length === 0) {
			this.router.navigate(['/welcome']);
		} else {
			this.router.navigate(['/main']);
		}
	}

	back() {
		this.router.navigate(['/welcome']);
	}
}
