import Parse from 'parse';

enum Column {
	NAME = 'name',
	CODE = 'code',
}

export class Language extends Parse.Object {
	static readonly CLS_NAME = 'Language';
	constructor() {
		super(Language.CLS_NAME);
	}

	get name() {
		return this.get(Column.NAME);
	}

	get code() {
		return this.get(Column.CODE);
	}

	static GetAll() {
		const query = new Parse.Query<Language>(Language.CLS_NAME);
		return query.find();
	}

	static Initialize() {
		console.log('Image initialized');
	}
}

console.log('xxx');
Parse.Object.registerSubclass(Language.CLS_NAME, Language);
