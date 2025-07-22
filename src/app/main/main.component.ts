import { Component, OnInit } from '@angular/core';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonRow,
	IonCol,
	IonGrid,
	IonButton,
	IonButtons,
	IonIcon,
} from '@ionic/angular/standalone';
import { ThemeableComponent } from '../themeable.component';
import { StorageService } from '../storage.service';
import { DigestsListComponent } from './digests-list/digests-list.component';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { registerNotifications } from '../services/push-notifications.service';
import { NavbarComponent } from '@app/shared/navbar/navbar.component';

@Component({
	imports: [
		IonIcon,
		IonButtons,
		IonButton,
		IonGrid,
		IonRow,
		IonContent,
		IonTitle,
		IonToolbar,
		IonHeader,
		DigestsListComponent,
		NavbarComponent,
	],
	selector: 'main',
	templateUrl: 'main.component.html',
})
export class MainComponent extends ThemeableComponent implements OnInit {
	constructor(storageService: StorageService, private router: Router) {
		super(storageService);
	}

	override async ngOnInit(): Promise<void> {
		await super.ngOnInit();
		User.bumpVisitDate();
	}

	logOut() {
		User.logOut();
		this.router.navigate(['/welcome']);
	}

	doRegisterNotifications() {
		registerNotifications();
	}
}
