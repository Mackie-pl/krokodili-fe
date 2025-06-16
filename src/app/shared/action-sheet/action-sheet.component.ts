import { Component, effect, ElementRef, input, signal } from '@angular/core';
import {
	AnimationController,
	Gesture,
	GestureController,
	GestureDetail,
	IonProgressBar,
	Animation,
} from '@ionic/angular/standalone';

@Component({
	selector: 'action-sheet',
	templateUrl: 'action-sheet.component.html',
	styleUrls: ['action-sheet.component.scss'],
	imports: [IonProgressBar],
	host: {
		class: 'action-sheet',
	},
})
export class ActionSheetComponent {
	private animation!: Animation;
	private gesture!: Gesture;
	private started = false;
	private initialStep = 0;

	private el: HTMLElement;

	private readonly MAX_TRANSLATE = 130;

	// _active = signal<boolean>(false);
	activeTimestamp = input.required<number>();
	loading = input.required<boolean>();

	constructor(
		private animationCtrl: AnimationController,
		private gestureCtrl: GestureController,
		el: ElementRef
	) {
		this.el = el.nativeElement;
		effect(() => {
			if (this.activeTimestamp() > 0 && !this.started) {
				this.animation.progressStart();

				this.animation.progressStep(this.activeTimestamp() > 0 ? 1 : 0);
				this.started = true;
			}
			// this._active.set(this.activeTimestamp() > 0);
		});
	}

	//TODO handle swipe like https://ionicframework.com/docs/utilities/animations#gesture-animations
	onHandleClick() {
		// this._active.set(!this._active());
		this.animation.progressStart();
		this.animation.progressStep(0);
		this.animation.progressEnd(0, 0).onFinish(() => {
			this.gesture.enable(true);
		});
		// this.started = true;
	}

	private onMove(event: GestureDetail) {
		if (!this.started) {
			this.animation.progressStart();
			this.started = true;
		}

		this.animation.progressStep(this.getPositionRatio(event));
	}

	private onEnd(event: GestureDetail) {
		if (!this.started) {
			return;
		}

		this.gesture.enable(false);

		const positionRatio = this.getPositionRatio(event);
		const shouldStay = positionRatio > 0.5;

		this.animation
			.progressEnd(shouldStay ? 1 : 0, positionRatio)
			.onFinish(() => {
				this.gesture.enable(true);
			});

		this.initialStep = shouldStay ? this.MAX_TRANSLATE : 0;
		this.started = false;
	}

	private clamp(min: number, n: number, max: number) {
		return Math.max(min, Math.min(n, max));
	}

	private getPositionRatio(event: GestureDetail) {
		const delta = event.deltaY;
		return 1 - this.clamp(0, delta / this.MAX_TRANSLATE, 1);
	}

	ngAfterViewInit() {
		this.animation = this.animationCtrl
			.create()
			.addElement(this.el)
			.duration(300)
			.fromTo(
				'transform',
				`translateY(${this.MAX_TRANSLATE}px)`,
				'translateY(0)'
			);

		const gesture = (this.gesture = this.gestureCtrl.create({
			el: this.el,
			threshold: 0,
			gestureName: 'card-drag',
			onMove: (event) => this.onMove(event),
			onEnd: (event) => this.onEnd(event),
		}));

		gesture.enable(true);
	}
}
