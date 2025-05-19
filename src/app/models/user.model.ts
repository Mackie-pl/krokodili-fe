import Parse from 'parse';
import { Subscription } from './subscription.model';
import { globalErrorHandler } from '../shared/global-error-handler';

export class User extends Parse.User {
	static readonly CLS_NAME = '_User';

	constructor() {
		super();
	}

	get name() {
		return this.get('name');
	}

	set name(name: string) {
		this.set('name', name);
	}

	get email() {
		return this.get('email');
	}

	set email(email: string) {
		this.set('email', email);
	}

	get password() {
		return this.get('password');
	}

	set password(password: string) {
		this.set('password', password);
	}

	async getSubscriptions() {
		const subsByUser = await Subscription.GetByUser(this).catch(
			globalErrorHandler
		);
		if (!subsByUser) return [];
		return subsByUser;
	}

	static async LogInAsGuest(): Promise<User> {
		// return Parse.AnonymousUtils.logIn() as any;
		const authData = {
			authData: {
				id: crypto.randomUUID(),
			},
		};

		const user = new User();

		const anonUser = (await user.linkWith('anonymous', authData)) as any;
		console.log(anonUser);
		return anonUser;
	}
}

Parse.User.registerSubclass(User.CLS_NAME, User);
