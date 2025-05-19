import Parse from 'parse';

enum Column {
	NAME = 'name',
	EMOJI = 'emoji',
	DESCRIPTION = 'description',
}

export class Topic extends Parse.Object {
	static readonly CLS_NAME = 'Topic';
	constructor() {
		super(Topic.CLS_NAME);
	}

	get name() {
		return this.get(Column.NAME);
	}

	get emoji() {
		return this.get(Column.EMOJI);
	}

	get description() {
		return this.get(Column.DESCRIPTION);
	}

	static GetAll() {
		const query = new Parse.Query<Topic>(Topic.CLS_NAME);
		return query.find();
	}
}

Parse.Object.registerSubclass(Topic.CLS_NAME, Topic);
