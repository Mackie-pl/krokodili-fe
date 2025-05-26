import { Component, OnInit } from '@angular/core';
import { Digest } from '@app/models/digest.model';
import { DigestCardComponent } from './digest-card/digest-card.component';
import { IonRow, IonCol } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'digests-list',
	templateUrl: 'digests-list.component.html',
	imports: [IonCol, IonRow, DigestCardComponent, RouterLink],
	// styleUrls: ["digests-list.component.scss"],
})
export class DigestsListComponent implements OnInit {
	digests: Digest[] = [];
	constructor() {}

	async ngOnInit(): Promise<void> {
		this.digests = await Digest.GetMine();
		console.log(this.digests);
	}
}
