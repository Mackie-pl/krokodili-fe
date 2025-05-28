import { Component, OnInit } from '@angular/core';
import { Digest } from '@app/models/digest.model';
import { DigestCardComponent } from './digest-card/digest-card.component';
import {
	IonRow,
	IonCol,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
	IonButton,
	IonSpinner,
	IonAlert,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'digests-list',
	templateUrl: 'digests-list.component.html',
	styleUrl: 'digests-list.component.scss',
	imports: [
		IonAlert,
		IonSpinner,
		IonButton,
		IonCardSubtitle,
		IonCardTitle,
		IonCardHeader,
		IonCard,
		IonCol,
		IonRow,
		DigestCardComponent,
		RouterLink,
	],
})
export class DigestsListComponent implements OnInit {
	olderPage = 0;
	digests: Digest[] = [];
	loadingFirstView = true;
	loadingMore = false;
	canLoadMore = true;
	isZeroResultsAlertOpen = false;
	constructor() {}

	async ngOnInit(): Promise<void> {
		this.digests = await Digest.GetMine();
		this.loadingFirstView = false;
		if (this.digests.length === 0) {
			this.tryToCheckIfFreshContentAppeared();
			this.isZeroResultsAlertOpen = true;
		}
	}

	tryToCheckIfFreshContentAppeared() {
		if (this.digests.length > 0) return;
		setTimeout(async () => {
			this.digests = await Digest.GetMine();
			if (this.digests.length === 0) {
				this.tryToCheckIfFreshContentAppeared();
			}
		}, 5000);
	}

	async loadOlder() {
		this.loadingMore = true;
		this.olderPage++;
		const digestsToAppend = await Digest.GetMine(this.olderPage);
		this.digests = [...this.digests, ...digestsToAppend].filter(
			(digest, i, arr) => arr.findIndex((d) => d.id === digest.id) === i
		);
		this.loadingMore = false;
		if (digestsToAppend.length < 10) {
			this.canLoadMore = false;
		}
	}
}
