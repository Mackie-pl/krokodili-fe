import { Component, OnInit } from '@angular/core';
import { StorageService } from './storage.service';

@Component({
	template: ``,
	host: {
		'[style.color-scheme]': `paletteToggle ? 'dark' : 'light'`,
	},
})
export class ThemeableComponent implements OnInit {
	paletteToggle = false;
	private storageValue: boolean | null = null;

	constructor(private storageService: StorageService) {}

	async ngOnInit() {
		await this.storageService.initialized;
		this.storageValue = (await this.storageService.get('dark')) as boolean;

		if (this.storageValue === null) {
			// Use matchMedia to check the user preference
			const prefersDark = window.matchMedia(
				'(prefers-color-scheme: dark)'
			);

			// Initialize the dark palette based on the initial
			// value of the prefers-color-scheme media query
			this.initializeDarkPalette(prefersDark.matches);

			// Listen for changes to the prefers-color-scheme media query
			prefersDark.addEventListener('change', (mediaQuery) =>
				this.initializeDarkPalette(mediaQuery.matches)
			);
		} else {
			this.initializeDarkPalette(this.storageValue!);
		}
	}

	// Check/uncheck the toggle and update the palette based on isDark
	initializeDarkPalette(isDark: boolean) {
		this.paletteToggle = isDark;
		this.toggleDarkPalette(isDark);
	}

	// Listen for the toggle check/uncheck to toggle the dark palette
	toggleChange() {
		this.paletteToggle = !this.paletteToggle;
		this.storageService.set('dark', this.paletteToggle);
		this.toggleDarkPalette(this.paletteToggle);
	}

	// Add or remove the "ion-palette-dark" class on the html element
	toggleDarkPalette(shouldAdd: boolean) {
		document.documentElement.classList.toggle(
			'ion-palette-dark',
			shouldAdd
		);
	}
}
