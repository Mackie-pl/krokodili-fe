import { Component, OnInit } from '@angular/core';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonRow,
	IonCol,
	IonGrid,
} from '@ionic/angular/standalone';
import { ThemeableComponent } from '../themeable.component';
import { StorageService } from '../storage.service';
import { DigestsListComponent } from './digests-list/digests-list.component';

@Component({
	imports: [
		IonGrid,
		IonCol,
		IonRow,
		IonContent,
		IonTitle,
		IonToolbar,
		IonHeader,
		DigestsListComponent,
	],
	selector: 'main',
	templateUrl: 'main.component.html',
})
export class MainComponent extends ThemeableComponent implements OnInit {
	constructor(storageService: StorageService) {
		super(storageService);
	}

	override async ngOnInit(): Promise<void> {
		await super.ngOnInit();
	}
}
