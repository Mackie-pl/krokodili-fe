import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'emojiToColor',
	standalone: true,
})
export class EmojiToColorPipe implements PipeTransform {
	private getAvgHex(color: number, total: number): string {
		return Math.round(color / total)
			.toString(16)
			.padStart(2, '0');
	}

	/**
	 * Converts RGB to HSL
	 * @param r Red (0-255)
	 * @param g Green (0-255)
	 * @param b Blue (0-255)
	 * @returns [h, s, l] where h is in [0,360) and s,l are in [0,1]
	 */
	private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
		// Normalize RGB values to [0,1]
		r /= 255;
		g /= 255;
		b /= 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}

			h /= 6;
		}

		return [h * 360, s, l];
	}

	/**
	 * Converts HSL to RGB
	 * @param h Hue [0,360)
	 * @param s Saturation [0,1]
	 * @param l Lightness [0,1]
	 * @returns [r, g, b] where each is in [0,255]
	 */
	private hslToRgb(h: number, s: number, l: number): [number, number, number] {
		// Ensure saturation and lightness are clamped between 0 and 1
		s = Math.max(0, Math.min(1, s));
		l = Math.max(0, Math.min(1, l));
		
		// Normalize hue to [0,1]
		h = ((h % 360) + 360) % 360 / 360;

		let r, g, b;

		if (s === 0) {
			// Achromatic (gray)
			r = g = b = l;
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = this.hueToRgb(p, q, h + 1/3);
			g = this.hueToRgb(p, q, h);
			b = this.hueToRgb(p, q, h - 1/3);
		}

		return [r * 255, g * 255, b * 255];
	}

	private hueToRgb(p: number, q: number, t: number): number {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1/6) return p + (q - p) * 6 * t;
		if (t < 1/2) return q;
		if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;
	}

	transform(emoji: string, options?: { saturation?: number; light?: number }): string {
		if (!emoji) return '#000000';

		let totalPixels = 0;
		const colors = {
			red: 0,
			green: 0,
			blue: 0,
			alpha: 0,
		};

		// Need to access document in browser context
		// This will only run in the browser
		if (typeof document !== 'undefined') {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (ctx) {
				ctx.font = '30px Arial';
				ctx.fillText(emoji, 0, 28);
				const imageData = ctx.getImageData(0, 0, 30, 30).data;

				for (let i = 0; i < imageData.length; i += 4) {
					const r = imageData[i];
					const g = imageData[i + 1];
					const b = imageData[i + 2];
					const a = imageData[i + 3];

					if (a > 50) {
						totalPixels += 1;
						colors.red += r;
						colors.green += g;
						colors.blue += b;
						colors.alpha += a;
					}
				}

				if (totalPixels > 0) {
					let r = colors.red / totalPixels;
					let g = colors.green / totalPixels;
					let b = colors.blue / totalPixels;

					// Convert RGB to HSL and apply saturation/lightness adjustments if provided
					const [h, s, l] = this.rgbToHsl(r, g, b);
					
					const finalS = options?.saturation !== undefined ? options.saturation : s;
					const finalL = options?.light !== undefined ? options.light : l;
					
					// Convert back to RGB
					const [adjustedR, adjustedG, adjustedB] = this.hslToRgb(h, finalS, finalL);
					
					// Convert to hex
					const rHex = Math.round(adjustedR).toString(16).padStart(2, '0');
					const gHex = Math.round(adjustedG).toString(16).padStart(2, '0');
					const bHex = Math.round(adjustedB).toString(16).padStart(2, '0');

					return '#' + rHex + gHex + bHex;
				}
			}
		}

		return '#000000'; // Default fallback color
	}
}
