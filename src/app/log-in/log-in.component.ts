import { Component } from '@angular/core';
import {
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
	IonContent,
} from '@ionic/angular/standalone';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { NavbarComponent } from '@app/shared/navbar/navbar.component';

@Component({
	selector: 'app-log-in',
	templateUrl: './log-in.component.html',
	styleUrls: ['./log-in.component.scss'],
	imports: [IonContent, IonGrid, IonRow, IonCol, IonButton, NavbarComponent],
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
