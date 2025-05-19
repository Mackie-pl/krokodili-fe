import { Component, OnInit } from '@angular/core';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
} from '@ionic/angular/standalone';

@Component({
	imports: [IonContent, IonTitle, IonToolbar, IonHeader],
	selector: 'main',
	templateUrl: 'main.component.html',
})
export class MainComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
