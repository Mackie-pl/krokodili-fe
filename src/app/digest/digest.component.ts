import { Component, ElementRef, input, signal, ViewChild } from '@angular/core';
import { Digest } from '../models/digest.model';
import { MarkdownComponent } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonGrid,
	AnimationController,
	GestureController,
} from '@ionic/angular/standalone';
import { ActionSheetComponent } from '../shared/action-sheet/action-sheet.component';
import { ThemeableComponent } from '../themeable.component';
import { StorageService } from '../storage.service';
import type {
	Animation,
	Gesture,
	GestureDetail,
} from '@ionic/angular/standalone';

@Component({
	selector: 'digest',
	templateUrl: 'digest.component.html',
	imports: [
		IonGrid,
		IonContent,
		IonTitle,
		IonToolbar,
		IonHeader,
		MarkdownComponent,
		ActionSheetComponent,
	],
	styleUrls: ['digest.component.scss'],
})
export class DigestComponent extends ThemeableComponent {
	digest = signal<Digest | null>(null);
	content = signal<string>('');
	focusedWord = signal<string>('');
	focusedWordTimestamp = signal<number>(0);
	// todo repolace with local storage
	translations: { [word: string]: string[] } = {};
	translationLoading = signal<boolean>(false);
	@ViewChild(ActionSheetComponent, { read: ElementRef })
	card!: ElementRef<HTMLIonCardElement>;

	constructor(storageService: StorageService, private route: ActivatedRoute) {
		super(storageService);
	}

	override async ngOnInit() {
		await super.ngOnInit();
		// Access route parameter
		const digestId = this.route.snapshot.paramMap.get('id');
		if (!digestId) return;
		this.loadDigest(digestId);
	}

	async loadDigest(digestId: string) {
		const digest = await Digest.Get(digestId);
		window.krokodiliVocabulary = digest.vocabulary.reduce((acc, word) => {
			acc.push(
				...word.usedForms.map((form) => ({
					wordOrPhrase: form,
					isTranslatable: !!word.definition,
				}))
			);
			return acc;
		}, [] as { wordOrPhrase: string; isTranslatable: boolean }[]);
		this.digest.set(digest);

		digest.vocabulary.forEach((word) => {
			if (word.definition) {
				this.translations[word.normalizedForm.toLowerCase()] =
					word.definition.split(', ');
				word.usedForms.forEach((form) => {
					this.translations[form.toLowerCase()] =
						word.definition?.split(', ') || [];
				});
			}
		});

		//replace [1] with markdown link from digest citations
		const content = digest.content.replace(
			/\[(\d+)\]/g,
			(match, number) => {
				const citation = digest.citations[number - 1];
				return `[${JSON.stringify(citation)}](${citation.url})`;
			}
		);

		this.content.set(content);
	}

	onMDClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.className === 'word') {
			const normalized =
				this.digest()
					?.vocabulary.find((v) =>
						v.usedForms.includes(target.textContent || '')
					)
					?.normalizedForm.toLowerCase() ||
				target.textContent?.toLowerCase() ||
				'';
			this.focusedWord.set(normalized);
			this.focusedWordTimestamp.set(Date.now());
			this.translateWord(normalized);
		}
	}

	onReady() {
		console.log('Ready');
	}

	async translateWord(word: string) {
		if (!word) return;
		if (this.translations[word]) return this.translations[word];
		this.translationLoading.set(true);
		const translations = await this.digest()?.getTranslations(word);
		this.translations[word] = translations;
		this.translationLoading.set(false);
		return translations;
	}
}
