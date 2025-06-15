import Parse from 'parse';

enum Column {
	FILE = 'file',
	COLOR = 'color',
}

export class Image extends Parse.Object {
	static readonly CLS_NAME = 'Image';
	constructor() {
		super(Image.CLS_NAME);
	}

	get file() {
		return this.get(Column.FILE);
	}

	get color() {
		return this.get(Column.COLOR);
	}

	static Initialize() {
		console.log('Image initialized');
	}
}

Parse.Object.registerSubclass(Image.CLS_NAME, Image);
