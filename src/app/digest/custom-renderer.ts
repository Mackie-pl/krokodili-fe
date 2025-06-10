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

		// first try to join words that are translated together with some character
		window.krokodiliVocabulary.forEach((word) => {
			str = str.replaceAll(
				word.wordOrPhrase,
				word.wordOrPhrase.replaceAll(/\s/g, '___')
			);
		});

		const tokens =
			str.match(/[\p{L}|___]+|\p{N}+|[^\p{L}\p{N}\s]|\s+/gu) || [];

		const out = tokens
			.map((token: string, i, arr) => {
				// console.log(token, token.includes('\n'));
				// Only wrap words (Unicode letters or numbers) in spans
				if (/^[\p{L}|___]+$/u.test(token)) {
					// console.log('token2', token);
					token = token.replaceAll(/___/g, ' ');
					// console.log('token3', token);
					const entryFound = window.krokodiliVocabulary.find(
						(entry) => entry.wordOrPhrase === token
					);
					if (entryFound && !entryFound.isTranslatable) {
						return token;
					}
					// if (
					// 	(window as any).properNounsWithinDigest.includes(token)
					// ) {
					// 	return token;
					// }

					// const isProperNoun = (window as any).properNounsWithinDigest.find((properNoun: string) => {
					// 	if (properNoun === token) return true;
					// 	if (properNoun.split(' ').includes(token)) {

					// 	}
					// });
					// if (isProperNoun) {
					// 	return `<span class="word proper-noun">${token}</span>`;
					// }
					return `<span class="word">${token}</span>`;
				}
				return token;
			})
			.join('');
		console.log(out);
		return out;
	};

	renderer.link = (link: Tokens.Link) => {
		return parseLink(link.text);
	};

	renderer.text = (text: Tokens.Text) => {
		let str = text.text;
		console.log('renderer.text', str);

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
		breaks: true,
		pedantic: false,
	};
}
