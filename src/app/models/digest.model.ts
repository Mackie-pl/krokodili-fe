import Parse from 'parse';

enum Column {
	CONTENT = 'content',
	IMAGE = 'image',
}

export class Digest extends Parse.Object {
	static readonly CLS_NAME = 'Digest';
	constructor() {
		super(Digest.CLS_NAME);
	}

	get content() {
		return this.get(Column.CONTENT);
	}

	get imageUrl() {
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
