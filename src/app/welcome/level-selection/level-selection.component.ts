import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	input,
	output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
	IonIcon,
} from '@ionic/angular/standalone';
import { Level } from '../../models/level.model';
@Component({
	selector: 'app-level-selection',
	templateUrl: 'level-selection.component.html',
	styleUrls: ['level-selection.component.scss'],
	imports: [IonButton, CommonModule, IonRow, IonCol, IonGrid, IonIcon],
})
export class LevelSelectionComponent {
	levels = input<Level[] | null>();
	selectedLevel: Level | null = null;
	levelSelected = output<Level>();
	constructor() {}

	selectLevel(level: Level) {
		this.selectedLevel = level;
	}

	continue() {
		console.log('Level selected:', this.selectedLevel);
		if (!this.selectedLevel) return;
		console.log('Level selected:', this.selectedLevel);
		this.levelSelected.emit(this.selectedLevel);
	}
}
