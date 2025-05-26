import { Parser } from 'marked';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
	const renderer = new MarkedRenderer();

	renderer.text = (text: { text: string }) => {
		console.log(text);
		const words = text.text.split(/(\s+)/);
		return words
			.map((word: string) => {
				if (word.trim() === '') {
					return word;
				}
				return `<span class="word">${word}</span>`;
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
