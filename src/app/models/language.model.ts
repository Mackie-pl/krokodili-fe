import Parse from 'parse';

enum Column {
	NAME = 'name',
}

export class Language extends Parse.Object {
	static readonly CLS_NAME = 'Language';
	constructor() {
		super(Language.CLS_NAME);
	}

	get name() {
		return this.get(Column.NAME);
	}

	static GetAll() {
		const query = new Parse.Query<Language>(Language.CLS_NAME);
		return query.find();
	}
}

Parse.Object.registerSubclass(Language.CLS_NAME, Language);
