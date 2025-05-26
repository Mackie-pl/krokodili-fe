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
		// const renderer = new MarkedRenderer();
		// const originalText = renderer.text.bind(renderer);

		// renderer.text = (text: any) => {
		// 	const words = text.split(/(\s+)/);
		// 	return words
		// 		.map((word: string) => {
		// 			if (word.trim() === '') {
		// 				return word;
		// 			}
		// 			return `<span class="word">${word}</span>`;
		// 		})
		// 		.join('');
		// };
		// this.markedOptions.renderer = renderer;
	}

	onReady() {
		console.log('Ready');
	}
}
