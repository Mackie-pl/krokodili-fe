import { Component, effect, input, signal } from '@angular/core';
import {
	Gesture,
	GestureController,
	IonProgressBar,
} from '@ionic/angular/standalone';

@Component({
	selector: 'action-sheet',
	templateUrl: 'action-sheet.component.html',
	styleUrls: ['action-sheet.component.scss'],
	imports: [IonProgressBar],
	host: {
		class: 'action-sheet',
		'[class.active]': '_active()',
	},
})
export class ActionSheetComponent {
	_active = signal<boolean>(false);
	activeTimestamp = input.required<number>();
	loading = input.required<boolean>();
	constructor() {
		effect(() => {
			console.log(this.activeTimestamp());
			this._active.set(this.activeTimestamp() > 0);
		});
	}

	//TODO handle swipe like https://ionicframework.com/docs/utilities/animations#gesture-animations
	onHandleClick() {
		this._active.set(!this._active());
	}
}
