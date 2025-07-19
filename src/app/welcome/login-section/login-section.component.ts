import { Component, output } from '@angular/core';
import {
	IonInput,
	IonInputPasswordToggle,
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
} from '@ionic/angular/standalone';
import { User } from '../../models/user.model';
@Component({
	selector: 'app-login-section',
	templateUrl: './login-section.component.html',
	styleUrls: ['./login-section.component.scss'],
	imports: [
		IonCol,
		IonRow,
		IonGrid,
		IonButton,
		IonInput,
		IonInputPasswordToggle,
	],
})
export class LoginSectionComponent {
	userPromise = output<Promise<User>>();
	async continueAsGuest() {
		console.log('continue as guest');
		this.userPromise.emit(User.LogInAsGuest());
	}

	async continueWithGoogle() {
		console.log('continue with google');
		this.userPromise.emit(User.getGoogleLoginUrl(true));
	}
}
