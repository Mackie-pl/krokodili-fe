import { Component, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	IonButton,
	IonGrid,
	IonRow,
	IonCol,
	IonIcon,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonCardContent,
	IonCardTitle,
} from '@ionic/angular/standalone';
import { Topic } from '../../models/topic.model';
import { EmojiToColorPipe } from '../../shared/pipes/emoji-to-color.pipe';
@Component({
	selector: 'app-topic-selection',
	templateUrl: 'topic-selection.component.html',
	styleUrls: ['topic-selection.component.scss'],
	imports: [
		IonCardTitle,
		IonCardContent,
		IonCardSubtitle,
		IonCardHeader,
		IonCard,
		IonButton,
		CommonModule,
		IonRow,
		IonCol,
		IonGrid,
		IonIcon,
		EmojiToColorPipe,
	],
})
export class TopicSelectionComponent {
	topics = input<Topic[] | null>();
	selectedTopic: Topic | null = null;
	topicSelected = output<Topic>();
	constructor() {}

	selectTopic(topic: Topic) {
		this.selectedTopic = topic;
	}

	continue() {
		if (!this.selectedTopic) return;
		this.topicSelected.emit(this.selectedTopic);
	}
}
