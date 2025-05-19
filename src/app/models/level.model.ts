import Parse from 'parse';

enum Column {
	NAME = 'name',
	INDEX = 'index',
	EMOJI = 'emoji',
	DESCRIPTION = 'description',
}

export class Level extends Parse.Object {
	static readonly CLS_NAME = 'Level';
	constructor() {
		super(Level.CLS_NAME);
	}

	get name() {
		return this.get(Column.NAME);
	}

	get emoji() {
		return this.get(Column.EMOJI);
	}

	get index() {
		return this.get(Column.INDEX);
	}

	get description() {
		return this.get(Column.DESCRIPTION);
	}

	static GetAll() {
		const query = new Parse.Query<Level>(Level.CLS_NAME);
		query.ascending(Column.INDEX);
		return query.find();
	}
}

Parse.Object.registerSubclass(Level.CLS_NAME, Level);
