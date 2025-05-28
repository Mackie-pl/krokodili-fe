import { Tokens, Parser } from 'marked';
import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { Citation } from '../models/digest.model';
// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
	const renderer = new MarkedRenderer();

	const parseLink = (linkStr: string) => {
		const data: Citation = JSON.parse(linkStr);
		return `<a href="${data.url}" title="${data.title}" class="chip" target="_blank"><img src="${data.imageUrl}" alt="${data.title}" />${data.title}</a>`;
	};

	const parseStrIntoWords = (str: string) => {
		// Split text into words and non-words (punctuation, spaces, etc.)
		// Using Unicode property escapes to match any letter from any language

		const tokens = str.match(/\p{L}+|\p{N}+|[^\p{L}\p{N}\s]|\s+/gu) || [];

		return tokens
			.map((token: string) => {
				//
				// Only wrap words (Unicode letters or numbers) in spans
				if (/^[\p{L}]+$/u.test(token)) {
					if (
						(window as any).properNounsWithinDigest.includes(token)
					) {
						return token;
					}
					return `<span class="word">${token}</span>`;
				}
				return token;
			})
			.join('');
	};

	renderer.link = (link: Tokens.Link) => {
		return parseLink(link.text);
	};

	renderer.text = (text: Tokens.Text) => {
		let str = text.text;

		// if it's url, return it as is
		if (str.startsWith('http')) {
			return str;
		}

		const returnParts = [];

		const linkRegexp = /\[({".*?"})\]\(([^)]+)\)/g;
		let match;
		while ((match = linkRegexp.exec(str)) !== null) {
			returnParts.push(parseStrIntoWords(str.slice(0, match.index)));
			returnParts.push(parseLink(match[1]));
			str = str.slice(match.index + match[0].length);
		}

		returnParts.push(parseStrIntoWords(str));
		return returnParts.join('');
	};

	return {
		renderer: renderer,
		gfm: true,
		breaks: false,
		pedantic: false,
	};
}
