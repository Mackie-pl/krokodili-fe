import { Component, input } from '@angular/core';
import {
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
} from '@ionic/angular/standalone';
import { Digest } from '@app/models/digest.model';

@Component({
	selector: 'digest-card',
	templateUrl: 'digest-card.component.html',
	styleUrls: ['digest-card.component.scss'],
	imports: [
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
	],
})
export class DigestCardComponent {
	digest = input.required<Digest>();
	constructor() {}
}
