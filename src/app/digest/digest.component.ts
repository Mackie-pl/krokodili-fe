import { Component, input, signal } from '@angular/core';
import { Digest } from '../models/digest.model';
import { MarkdownComponent, MarkedRenderer } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonGrid,
} from '@ionic/angular/standalone';
import { MarkedOptions } from 'ngx-markdown';

@Component({
	selector: 'digest',
	templateUrl: 'digest.component.html',
	imports: [
		IonGrid,
		IonContent,
		IonTitle,
		IonToolbar,
		IonHeader,
		MarkdownComponent,
	],
	styleUrls: ['digest.component.scss'],
})
export class DigestComponent {
	digest = signal<Digest | null>(null);
	content = signal<string>('');
	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		// Access route parameter
		const digestId = this.route.snapshot.paramMap.get('id');
		if (!digestId) return;
		this.loadDigest(digestId);
	}

	async loadDigest(digestId: string) {
		const digest = await Digest.Get(digestId);
		this.digest.set(digest);

		//replace [1] with markdown link from digest citations
		const content = digest.content.replace(
			/\[(\d+)\]/g,
			(match, number) => {
				const citation = digest.citations[number - 1];
				return `[${JSON.stringify(citation)}](${citation.url})`;
			}
		);

		this.content.set(content);
	}

	onReady() {
		console.log('Ready');
	}
}
