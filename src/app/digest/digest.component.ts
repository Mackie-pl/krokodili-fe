import { Component, input, signal } from '@angular/core';
import { Digest } from '../models/digest.model';
import { MarkdownComponent } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonGrid,
} from '@ionic/angular/standalone';
import { ActionSheetComponent } from '../shared/action-sheet/action-sheet.component';
import { ThemeableComponent } from '../themeable.component';
import { StorageService } from '../storage.service';

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
		(window as any).properNounsWithinDigest = digest.vocabulary
			.filter((word) => word.isProperNoun)
			.reduce((acc, word) => {
				acc.push(...word.usedForms);
				return acc;
			}, [] as string[]);
		this.digest.set(digest);

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
		console.log(target);
		if (target.className === 'word') {
			this.focusedWord.set(target.textContent || '');
			this.focusedWordTimestamp.set(Date.now());
			this.translateWord(target.textContent || '');
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
