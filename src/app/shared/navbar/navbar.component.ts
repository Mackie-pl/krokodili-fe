import { Component, input, computed } from '@angular/core';
import { ThemeableComponent } from '../../themeable.component';
import { StorageService } from '../../storage.service';
import {
	IonHeader,
	IonButton,
	IonIcon,
	IonTitle,
	IonButtons,
	IonToolbar,
} from '@ionic/angular/standalone';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { registerNotifications } from '../../services/push-notifications.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	imports: [
		IonToolbar,
		IonButtons,
		IonTitle,
		IonIcon,
		IonButton,
		IonHeader,
		ThemeableComponent,
	],
})
export class NavbarComponent extends ThemeableComponent {
	isWelcome = input<boolean>(false);
	isAuthenticated = computed(() => {
		console.log('User.isAuthenticated():', User.isAuthenticated());
		return User.isAuthenticated();
	});
	constructor(storageService: StorageService, private router: Router) {
		super(storageService);
	}

	doRegisterNotifications() {
		registerNotifications();
	}

	logOut() {
		User.logOut();
		this.router.navigate(['/welcome']);
	}
}
