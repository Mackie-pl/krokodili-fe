import Parse from 'parse';
import { Language } from './language.model';
import { Level } from './level.model';
import { Topic } from './topic.model';

enum Column {
	USER = 'user',
	LEVEL = 'level',
	TOPIC = 'topic',
}

export class Subscription extends Parse.Object {
	static readonly CLS_NAME = 'Subscription';
	constructor() {
		super(Subscription.CLS_NAME);
	}

	get user() {
		return this.get(Column.USER);
	}

	get level() {
		return this.get(Column.LEVEL);
	}

	get topic() {
		return this.get(Column.TOPIC);
	}

	static GetByUser(user: Parse.User) {
		const query = new Parse.Query<Subscription>(Subscription.CLS_NAME);
		query.equalTo(Column.USER, user);
		return query.find();
	}

	static async SubscribeGeneric(
		language: Language,
		level: Level,
		topic: Topic
	) {
		const sub = await Parse.Cloud.run('subscribeGeneric', {
			languageId: language.id,
			levelId: level.id,
			topicId: topic.id,
		});
		return sub;
	}
}

Parse.Object.registerSubclass(Subscription.CLS_NAME, Subscription);
