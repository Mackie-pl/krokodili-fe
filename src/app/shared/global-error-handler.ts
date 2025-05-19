import Parse from 'parse';

export const globalErrorHandler = (error: Parse.Error) => {
	console.log(error);
	switch (error.code) {
		case Parse.Error.INVALID_SESSION_TOKEN:
			Parse.User.logOut();
			break;
		default:
			console.error(error);
	}
};
