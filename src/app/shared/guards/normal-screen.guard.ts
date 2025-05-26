import { Injectable } from '@angular/core';
import { User } from '@app/models/user.model';
import { Router, UrlTree } from '@angular/router';
@Injectable({
	providedIn: 'root',
})
export class NormalScreenGuard {
	constructor(private router: Router) {}

	async canActivate(): Promise<boolean | UrlTree> {
		const loggedInUser = User.current() as User;
		const welcomeTree = this.router.createUrlTree(['/welcome']);
		if (!loggedInUser) return welcomeTree;
		const subscriptions = await loggedInUser.getSubscriptions();
		if (subscriptions.length === 0) return welcomeTree;
		return true;
	}
}
