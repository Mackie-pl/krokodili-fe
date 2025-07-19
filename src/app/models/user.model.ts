import Parse from 'parse';
import { Subscription } from './subscription.model';
import { globalErrorHandler } from '../shared/global-error-handler';
import { Device } from '@capacitor/device';

enum Column {
	LAST_VISIT_DATE = 'lastVisitDate',
	NAME = 'name',
	EMAIL = 'email',
	PASSWORD = 'password',
	USERNAME = 'username',
}

export class User extends Parse.User {
	static async bumpVisitDate() {
		const user = Parse.User.current();
		if (!user) return;
		user.set(Column.LAST_VISIT_DATE, new Date());
		user.save();
	}
	static readonly GOOGLE_SIGN_IN_FUNC = 'GoogleSignIn';
	static readonly GOOGLE_TOKEN_FUNC = 'GoogleToken';
	static readonly CLS_NAME = '_User';

	static googleOauthPromise: Promise<User>;
	constructor() {
		super();
	}

	get name() {
		return this.get(Column.NAME);
	}

	set name(name: string) {
		this.set(Column.NAME, name);
	}

	get email() {
		return this.get(Column.EMAIL);
	}

	set email(email: string) {
		this.set(Column.EMAIL, email);
	}

	get password() {
		return this.get(Column.PASSWORD);
	}

	set password(password: string) {
		this.set(Column.PASSWORD, password);
	}

	get username() {
		return this.get(Column.USERNAME);
	}

	set username(username: string) {
		this.set(Column.USERNAME, username);
	}

	async getSubscriptions() {
		const subsByUser = await Subscription.GetByUser(this).catch(
			globalErrorHandler
		);
		if (!subsByUser) return [];
		return subsByUser;
	}

	static uuidv4() {
		return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
			(
				+c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] &
					(15 >> (+c / 4)))
			).toString(16)
		);
	}

	static async LogInAsGuest(): Promise<User> {
		// return Parse.AnonymousUtils.logIn() as any;
		const id = this.uuidv4();
		const authData = {
			authData: {
				id,
			},
		};

		const user = new User();

		const anonUser = (await user.linkWith('anonymous', authData)) as any;
		console.log(anonUser);
		return anonUser;
	}

	static async getGoogleLoginUrl() {
		const params = {
			redirectUri: window.location.origin + '/callback/google-oauth.html',
		};
		const url = await Parse.Cloud.run(User.GOOGLE_SIGN_IN_FUNC, params);
		console.log('Opening Google OAuth URL:', url);

		const deviceInfo = await Device.getInfo();
		const isWeb = deviceInfo.platform === 'web';
		if (isWeb) {
			// Open OAuth in a popup
			const width = 500;
			const height = 600;
			const left = (window.screen.width - width) / 2;
			const top = (window.screen.height - height) / 2;

			const popup = window.open(
				url,
				'googleOAuth',
				`width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no`
			);

			if (!popup) {
				throw new Error(
					'Popup blocked. Please allow popups for this site.'
				);
			}

			return new Promise<User>((resolve, reject) => {
				// Listen for messages from the popup
				const messageHandler = (event: MessageEvent) => {
					console.log('Received message:', event);
					if (event.origin !== window.location.origin) return;

					switch (event.data.type) {
						case 'GOOGLE_OAUTH_CODE':
							window.removeEventListener(
								'message',
								messageHandler
							);
							// Exchange the code for a token
							this.exchangeCodeForToken(event.data.code)
								.then((user) => resolve(user))
								.catch(reject);
							break;
						case 'GOOGLE_OAUTH_ERROR':
							window.removeEventListener(
								'message',
								messageHandler
							);
							reject(
								new Error(
									event.data.error || 'OAuth error occurred'
								)
							);
							break;
					}
				};

				window.addEventListener('message', messageHandler);

				// Check if the popup was closed manually
				const popupCheckInterval = setInterval(() => {
					if (popup.closed) {
						clearInterval(popupCheckInterval);
						window.removeEventListener('message', messageHandler);
						reject(new Error('Authentication window was closed'));
					}
				}, 500);

				// Clean up interval when promise settles
				const cleanup = () => clearInterval(popupCheckInterval);
				resolve = (
					(original) =>
					(...args) => {
						cleanup();
						return original(...args);
					}
				)(resolve);
				reject = (
					(original) =>
					(...args) => {
						cleanup();
						return original(...args);
					}
				)(reject);
			});
		}
		throw new Error('Google OAuth is only supported in web browsers');
	}

	private static async exchangeCodeForToken(code: string): Promise<User> {
		console.log('Exchanging code for token:', code);
		try {
			// Call your backend to exchange the code for a token
			const authDetails = await Parse.Cloud.run(User.GOOGLE_TOKEN_FUNC, {
				code,
				redirectUri:
					window.location.origin + '/callback/google-oauth.html',
			});
			const authData = {
				id: authDetails.id,
				access_token: authDetails.access_token,
				id_token: authDetails.id_token,
				refresh_token: authDetails.refresh_token,
			};
			const user = new User();
			await user.linkWith('google', { authData });
			user.set('username', authDetails.name);
			user.set('email', authDetails.email);
			await user.save();
			return user;
		} catch (error) {
			console.error('Failed to exchange code for token:', error);
			throw new Error('Failed to authenticate with Google');
		}
	}
}

Parse.User.registerSubclass(User.CLS_NAME, User);
