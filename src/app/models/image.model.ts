import Parse from 'parse';

enum Column {
	FILE = 'file',
}

export class Image extends Parse.Object {
	static readonly CLS_NAME = 'Image';
	constructor() {
		super(Image.CLS_NAME);
	}

	get file() {
		return this.get(Column.FILE);
	}

	static Initialize() {
		console.log('Image initialized');
	}
}

Parse.Object.registerSubclass(Image.CLS_NAME, Image);
