import Parse from 'parse';
import { Language } from './language.model';
import { environment } from '../../environments/environment';
import LiveQuerySubscription from 'parse/types/LiveQuerySubscription';
import { Signal, signal } from '@angular/core';

enum Column {
	ID = 'objectId',
	CONTENT = 'content',
	IMAGE = 'image',
	CITATIONS = 'citations',
	VOCABULARY = 'vocabulary',
	LANGUAGE = 'language',
	LEVEL = 'level',
	TOPIC = 'topic',
	DIGEST_DATE_STR = 'digestDateStr',
	STATE = 'state',
	WORKING_CURRENT_LENGTH = 'workingCurrentLength',
	WORKING_REST_LENGTH = 'workingRestLength',
}
export type Citation = {
	title: string;
	url: string;
	imageUrl: string;
};
// {normalizedForm: "^Apple", isChallenging: false, isProperNoun: true, usedForms: ["Apple"]}
export type VocabEntry = {
	normalizedForm: string;
	isChallenging: boolean;
	isProperNoun: boolean;
	usedForms: string[];
	definition?: string;
};

export const DigestState = {
	PREPARING: 'preparing',
	READY: 'ready',
};
type DigestState = keyof typeof DigestState;
export class Digest extends Parse.Object {
	static appearedMap = new Map<string, number>();
	private _progress = signal(0);
	private progressUpdateInterval: any;
	static liveClient: Parse.LiveQueryClient;
	static liveQuerySubscription: LiveQuerySubscription | undefined;
	_title = '';
	_firstLine = '';
	updateSignal = signal<{
		currentOperationSeconds?: number;
		restSeconds?: number;
		state: DigestState;
	} | null>(null);
	static readonly CLS_NAME = 'Digest';
	constructor() {
		super(Digest.CLS_NAME);
		if (this.id && !Digest.appearedMap.has(this.id))
			Digest.appearedMap.set(this.id, Date.now());
		console.log(
			'constructor',
			this.id,
			this.get(Column.WORKING_CURRENT_LENGTH),
			this.get(Column.WORKING_REST_LENGTH)
		);
		this.updateProgress();
	}

	get isReady(): boolean {
		return this.get(Column.STATE) === DigestState.READY;
	}

	get progress(): Signal<number> {
		return this._progress;
	}

	get content(): string {
		return this.get(Column.CONTENT);
	}

	get title(): string {
		if (!this.isReady) return 'Preparing...';
		if (!this._title) {
			this._title = this.get(Column.CONTENT)
				.split('\n')[0]
				.trim()
				.replace(/\*+/g, '')
				.replace(/^#+/g, '');
		}
		return this._title;
	}

	get firstLine(): string {
		if (!this._firstLine) {
			const content: string = this.get(Column.CONTENT);
			if (content.split('\n').length < 2) return '';
			this._firstLine = content
				.split('\n')
				.filter((line) => line.trim() !== '')[1]
				.replace(/\*+/g, '')
				.replace(/^#+/g, '')
				.trim();
		}
		return this._firstLine;
	}

	getDate(): string {
		const dateStr = this.get(Column.DIGEST_DATE_STR);
		return new Date(dateStr).toLocaleDateString();
	}

	get citations(): Citation[] {
		const rawCitations: (Citation | string)[] = this.get(Column.CITATIONS);
		return rawCitations.map((citation) => {
			if (typeof citation === 'string') {
				const titleFromDomain = citation
					.split('//')[1]
					.replace('www.', '')
					.split('/')[0];
				const domain = citation.split('//')[1].split('/')[0];
				const imageUrlFavicon = `https://www.google.com/s2/favicons?domain=${domain}`;
				return {
					title: titleFromDomain,
					url: citation,
					imageUrl: imageUrlFavicon,
				};
			}
			return citation;
		});
	}

	get vocabulary(): VocabEntry[] {
		const rawVocabulary: VocabEntry[] = this.get(Column.VOCABULARY);
		return rawVocabulary.map((word) => {
			const clearedNormalizedForm = word.normalizedForm.replace(
				/^[\*\^]/,
				''
			);
			return { ...word, normalizedForm: clearedNormalizedForm };
		});
	}

	get imageUrl(): string {
		return (
			this.get(Column.IMAGE)?.file.url() || 'assets/images/not_found.jpeg'
		);
	}

	get language(): Language {
		return this.get(Column.LANGUAGE);
	}

	static async GetMine(olderPage?: number) {
		const digests: Digest[] = await Parse.Cloud.run('getMyDigests', {
			olderPage,
		});
		// if there is digest in preparation, start live query
		const notReadyDigests = digests.filter((digest) => !digest.isReady);
		if (notReadyDigests.length > 0 && !Digest.liveClient) {
			Digest.liveClient = new Parse.LiveQueryClient({
				applicationId: environment.PARSE_APP_ID,
				serverURL: 'wss://' + environment.PARSE_SERVER_URL,
				javascriptKey: environment.PARSE_JAVASCRIPT_KEY,
			} as any);
			Digest.liveClient.open();
			const query = new Parse.Query(Digest.CLS_NAME);
			query.containedIn(
				Column.ID,
				notReadyDigests.map((digest) => digest.id)
			);
			Digest.liveQuerySubscription = Digest.liveClient.subscribe(query);
			Digest.liveQuerySubscription?.on('update', (object: Digest) => {
				console.log(
					object,
					object.get(Column.STATE),
					object.get(Column.WORKING_CURRENT_LENGTH),
					object.get(Column.WORKING_REST_LENGTH)
				);

				if (object.get(Column.STATE) === DigestState.READY) {
					object.get(Column.IMAGE)?.fetch();
				} else {
					object.updateProgress();
				}
			});
		}
		return digests;
	}

	private updateProgress() {
		if (this.progressUpdateInterval)
			clearInterval(this.progressUpdateInterval);
		if (!this.id) return;
		const elapsedTimeSec =
			(Date.now() - Digest.appearedMap.get(this.id)!) / 1000;
		const fullTimeSec =
			elapsedTimeSec +
			this.get(Column.WORKING_CURRENT_LENGTH) +
			this.get(Column.WORKING_REST_LENGTH);
		const progressNow = elapsedTimeSec / fullTimeSec;
		this._progress.update((prev) => Math.max(progressNow, prev));
		// we need to go towards WORKING_CURRENT_LENGTH but in a way that we never get there, 90% of the way
		const INTERVAL = 100;
		const targetProgressAfterCurrentTime =
			(elapsedTimeSec + this.get(Column.WORKING_CURRENT_LENGTH)) /
			fullTimeSec;
		const TARGET_MULTIPLIER = 0.9;
		const now = Date.now();
		console.log(
			'progress value1',
			this.progress(),
			elapsedTimeSec,
			fullTimeSec,
			targetProgressAfterCurrentTime,
			this.get(Column.WORKING_CURRENT_LENGTH),
			this.get(Column.WORKING_REST_LENGTH)
		);
		this.progressUpdateInterval = setInterval(() => {
			const restOfProgress =
				targetProgressAfterCurrentTime - this.progress();
			this._progress.update((prev) =>
				Math.min(
					prev + restOfProgress * TARGET_MULTIPLIER,
					targetProgressAfterCurrentTime
				)
			);
			console.log('progress value2', this.progress());
		}, INTERVAL);
	}

	static Get(id: string) {
		return new Parse.Query<Digest>(Digest.CLS_NAME)
			.include(Column.IMAGE)
			.include(Column.LANGUAGE)
			.include(Column.LEVEL)
			.include(Column.TOPIC)
			.get(id);
	}

	async getTranslations(word: string) {
		const source = this.language.code;
		// TODO use some selection, for now it's browser language
		// const target = navigator.language;
		const target = 'en';
		const response = await Parse.Cloud.run('getTranslation', {
			word,
			source,
			target,
		});
		console.log(response);
		return response;
	}
}

Parse.Object.registerSubclass(Digest.CLS_NAME, Digest);

// <welcome _nghost-ng-c1799751041 class=​"ion-page ion-page-hidden" style=​"color-scheme:​ dark;​ z-index:​ 100;​" aria-hidden=​"true">​…​</welcome>​slot
// digest.model.ts:163 t {id: 'mSTUB3jHws', _localId: undefined, _objCount: 38, className: 'Digest', appearedMap: Map(0), …} 'preparing' 5 25
// digest.model.ts:163 t {id: 'mSTUB3jHws', _localId: undefined, _objCount: 46, className: 'Digest', appearedMap: Map(0), …} 'preparing' 10 15
// digest.model.ts:163 t {id: 'mSTUB3jHws', _localId: undefined, _objCount: 54, className: 'Digest', appearedMap: Map(0), …} 'preparing' 10 5
// digest.model.ts:163 t {id: 'mSTUB3jHws', _localId: undefined, _objCount: 62, className: 'Digest', appearedMap: Map(0), …} 'preparing' 5 0
