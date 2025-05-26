import { Tokens, Parser } from 'marked';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { Citation } from '../models/digest.model';
// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
	const renderer = new MarkedRenderer();
	renderer.link = (link: Tokens.Link) => {
		const data: Citation = JSON.parse(link.text);
		return `<a href="${data.url}" title="${data.title}" class="chip" target="_blank"><img src="${data.imageUrl}" alt="${data.title}" />${data.title}</a>`;
	};

	renderer.text = (text: { text: string }) => {
		// if it's url, return it as is
		if (text.text.startsWith('http')) {
			return text.text;
		}
		// Split text into words and non-words (punctuation, spaces, etc.)
		// Using Unicode property escapes to match any letter from any language
		const tokens =
			text.text.match(/\p{L}+|\p{N}+|[^\p{L}\p{N}\s]|\s+/gu) || [];

		return tokens
			.map((token: string) => {
				//
				// Only wrap words (Unicode letters or numbers) in spans
				if (/^[\p{L}]+$/u.test(token)) {
					return `<span class="word">${token}</span>`;
				}
				return token;
			})
			.join('');
	};

	return {
		renderer: renderer,
		gfm: true,
		breaks: false,
		pedantic: false,
	};
}
