import Parse from 'parse';

enum Column {
	CONTENT = 'content',
	IMAGE = 'image',
	CITATIONS = 'citations',
}
export type Citation = {
	title: string;
	url: string;
	imageUrl: string;
};
export class Digest extends Parse.Object {
	static readonly CLS_NAME = 'Digest';
	constructor() {
		super(Digest.CLS_NAME);
	}

	get content(): string {
		return this.get(Column.CONTENT);
	}

	get citations(): Citation[] {
		const rawCitations: (Citation | string)[] = this.get(Column.CITATIONS);
		return rawCitations.map((citation) => {
			if (typeof citation === 'string') {
				const titleFromDomain = citation
					.split('//')[1]
					.replace('www.', '')
					.split('/')[0];
				const imageUrlFavicon = `https://www.google.com/s2/favicons?domain=${citation}`;
				return {
					title: titleFromDomain,
					url: citation,
					imageUrl: imageUrlFavicon,
				};
			}
			return citation;
		});
	}

	get imageUrl(): string {
		return this.get(Column.IMAGE).file.url();
	}

	static GetMine() {
		return Parse.Cloud.run('getMyDigests');
	}

	static Get(id: string) {
		return new Parse.Query<Digest>(Digest.CLS_NAME)
			.include(Column.IMAGE)
			.get(id);
	}
}

Parse.Object.registerSubclass(Digest.CLS_NAME, Digest);
