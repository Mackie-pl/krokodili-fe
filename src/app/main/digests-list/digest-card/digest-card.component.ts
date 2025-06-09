import { Component, input } from '@angular/core';
import {
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonCardContent,
	IonProgressBar,
} from '@ionic/angular/standalone';
import { Digest } from '@app/models/digest.model';

@Component({
	selector: 'digest-card',
	templateUrl: 'digest-card.component.html',
	styleUrls: ['digest-card.component.scss'],
	imports: [
		IonProgressBar,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		IonCardContent,
		IonProgressBar,
	],
})
export class DigestCardComponent {
	digest = input.required<Digest>();
	constructor() {}
}
