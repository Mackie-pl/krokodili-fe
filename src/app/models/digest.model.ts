import Parse from 'parse';
import { Language } from './language.model';

enum Column {
	CONTENT = 'content',
	IMAGE = 'image',
	CITATIONS = 'citations',
	VOCABULARY = 'vocabulary',
	LANGUAGE = 'language',
	LEVEL = 'level',
	TOPIC = 'topic',
	DIGEST_DATE_STR = 'digestDateStr',
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
};
export class Digest extends Parse.Object {
	_title = '';
	_firstLine = '';
	static readonly CLS_NAME = 'Digest';
	constructor() {
		super(Digest.CLS_NAME);
	}

	get content(): string {
		return this.get(Column.CONTENT);
	}

	get title(): string {
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

	static GetMine(olderPage?: number) {
		return Parse.Cloud.run('getMyDigests', { olderPage });
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
