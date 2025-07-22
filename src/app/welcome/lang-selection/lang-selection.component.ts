import { Component, OnInit, output, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language } from '@app/models/language.model';
import { ThemeableComponent } from '@app/themeable.component';
import { StorageService } from '@app/storage.service';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { IonRow, IonCol, IonGrid, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { User } from '@app/models/user.model';

@Component({
	selector: 'app-lang-selection',
	templateUrl: './lang-selection.component.html',
	styleUrls: ['./lang-selection.component.scss'],
	imports: [
		IonButton,
		CommonModule,
		IonRow,
		IonCol,
		IonGrid,
		SanitizeHtmlPipe,
	],
})
export class LangSelectionComponent
	extends ThemeableComponent
	implements OnInit
{
	languageSelected = output<Language>();
	languages = input<Language[] | null>();
	loading = true;
	selectedLanguage: Language | null = null;
	isAuthenticated = computed(() => {
		return User.isAuthenticated();
	});

	constructor(storageService: StorageService, private router: Router) {
		super(storageService);
	}

	override async ngOnInit() {
		await super.ngOnInit();
		try {
		} catch (error) {
			console.error('Error loading languages:', error);
		}
		this.loading = false;
	}

	selectLanguage(language: Language) {
		this.selectedLanguage = language;
		// Store the selected language preference
		// We use a separate localStorage method since storageService is private in the parent class
		// localStorage.setItem('selectedLanguage', language.name);
	}

	getLanguageFlagSvg(languageName: string): string {
		// Map language names to SVG content
		const svgMap: Record<string, string> = {
			English:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#a)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#b)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></g></svg>',
			Spanish:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500"><rect width="750" height="500" fill="#c60b1e"/><rect width="750" height="250" fill="#ffc400" y="125"/></svg>',
			French: '<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#ED2939"/><rect width="600" height="600" fill="#fff"/><rect width="300" height="600" fill="#002395"/></svg>',
			German: '<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#D00"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>',
			Italian:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#009246"/><rect width="1" height="2" x="1" fill="#fff"/><rect width="1" height="2" x="2" fill="#ce2b37"/></svg>',
			Polish: '<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><rect width="16" height="10" fill="#fff"/><rect width="16" height="5" fill="#dc143c" y="5"/></svg>',
			Portuguese:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#006600"/><rect width="240" height="400" fill="#FF0000" x="180"/><circle cx="300" cy="200" r="65" fill="#FFFF00" stroke="#000" stroke-width="1.5"/></svg>',
			Russian:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><rect width="9" height="6" fill="#fff"/><rect width="9" height="4" y="2" fill="#0039A6"/><rect width="9" height="2" y="4" fill="#D52B1E"/></svg>',
			Chinese:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="20" fill="#DE2910"/><g fill="#FFDE00"><path d="M5,5 5,2.5 6.5,1 8,2.5 8,5z"/><path d="M10,2 11,1 12,2 11,3z"/><path d="M12,4 13,3 14,4 13,5z"/><path d="M12,7 11,6 12,5 13,6z"/><path d="M10,9 9,8 10,7 11,8z"/></g></svg>',
			Japanese:
				'<svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#fff"/><circle cx="450" cy="300" r="180" fill="#bc002d"/></svg>',
		};

		return (
			svgMap[languageName] ||
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/><text x="12" y="16" font-size="10" text-anchor="middle" fill="#999">?</text></svg>'
		);
	}

	continue() {
		if (!this.selectedLanguage) return;
		this.languageSelected.emit(this.selectedLanguage);
	}

	logIn() {
		this.router.navigate(['/login']);
	}
}
