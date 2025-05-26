import { Component, OnInit } from '@angular/core';
import { Language } from '../models/language.model';
import { Level } from '../models/level.model';
import { ThemeableComponent } from '../themeable.component';
import { Router } from '@angular/router';
import {
	IonHeader,
	IonToolbar,
	IonButton,
	IonButtons,
	IonIcon,
	IonContent,
	IonLoading,
	IonAlert,
} from '@ionic/angular/standalone';
import { StorageService } from '../storage.service';
import { LangSelectionComponent } from './lang-selection/lang-selection.component';
import { LevelSelectionComponent } from './level-selection/level-selection.component';
import { TopicSelectionComponent } from './topic-selection/topic-selection.component';
import { Topic } from '../models/topic.model';
import { LoginSectionComponent } from './login-section/login-section.component';
import { User } from '../models/user.model';
import { Subscription } from '../models/subscription.model';
import Parse from 'parse';
@Component({
	selector: 'welcome',
	templateUrl: 'welcome.component.html',
	styleUrls: ['welcome.component.scss'],
	imports: [
		IonAlert,
		IonLoading,
		IonIcon,
		IonButtons,
		IonHeader,
		IonToolbar,
		IonButton,
		IonContent,
		LangSelectionComponent,
		LevelSelectionComponent,
		TopicSelectionComponent,
		LoginSectionComponent,
	],
	standalone: true,
})
export class WelcomeComponent extends ThemeableComponent implements OnInit {
	currentScreen = 'lang-selection';
	errorAlert: string | null = null;
	alertButtons = ['OK'];

	languages: Language[] | null = null;
	levels: Level[] | null = null;
	topics: Topic[] | null = null;
	loadingOnWelcomeFinishing = false;
	selectedLanguage: Language | null = null;
	selectedLevel: Level | null = null;
	selectedTopic: Topic | null = null;
	constructor(storageService: StorageService, private router: Router) {
		super(storageService);
	}

	override async ngOnInit() {
		await super.ngOnInit();
		this.languages = await Language.GetAll();
		this.levels = await Level.GetAll();
		this.topics = await Topic.GetAll();
	}

	onLanguageSelected(language: Language) {
		console.log('Language selected:', language.name);
		this.selectedLanguage = language;
		this.currentScreen = 'level-selection';
	}

	onLevelSelected(level: Level) {
		console.log('Level selected:', level.name);
		this.selectedLevel = level;
		this.currentScreen = 'topic-selection';
	}

	onTopicSelected(topic: Topic) {
		console.log('Topic selected:', topic.name);
		this.selectedTopic = topic;
		if (!User.current()) this.currentScreen = 'login-section';
		else this.onWelcomeFinishing();
	}

	async onWelcomeFinishing(userPromise?: Promise<User>) {
		this.loadingOnWelcomeFinishing = true;
		console.log('WelcomeComponent.onWelcomeFinishing');
		if (userPromise) await userPromise;
		console.log('WelcomeComponent.onWelcomeFinishing 2');

		let error: any;
		try {
			await Subscription.SubscribeGeneric(
				this.selectedLanguage!,
				this.selectedLevel!,
				this.selectedTopic!
			);
		} catch (error: any) {
			if (error.code === Parse.Error.SCRIPT_FAILED) {
				if (error.error.code === 601) {
					this.loadingOnWelcomeFinishing = false;
					this.errorAlert = 'You have too many subscriptions.';
				}
			}
			console.error('Error subscribing:', error.code);
			error = error;
		}
		this.loadingOnWelcomeFinishing = false;
		if (error) return;
		this.router.navigate(['/main']);
	}

	onAlertDismiss() {
		this.errorAlert = null;
		this.router.navigate(['/main']);
	}
}
