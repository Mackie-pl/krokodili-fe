import { Injectable } from '@angular/core';
import { User } from '@app/models/user.model';
import { Router, UrlTree } from '@angular/router';
@Injectable({
	providedIn: 'root',
})
export class WelcomeScreenGuard {
	constructor(private router: Router) {}

	async canActivate(): Promise<boolean | UrlTree> {
		const loggedInUser = User.current() as User;
		if (!loggedInUser) return true;
		const subscriptions = await loggedInUser.getSubscriptions();
		if (subscriptions.length === 0) return true;
		const tree = this.router.createUrlTree(['/main']);
		return tree;
	}
}
