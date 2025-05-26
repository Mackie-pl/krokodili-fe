import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private _storage: Storage | null = null;
	private resolve!: () => void;
	public initialized = new Promise<void>((resolve) => {
		this.resolve = resolve;
	});

	constructor(private storage: Storage) {
		this.init();
	}

	async init() {
		const storage = await this.storage.create();
		this._storage = storage;
		this.resolve();
	}
	public set(key: string, value: any) {
		this._storage?.set(key, value);
	}
	public get(key: string) {
		return this._storage?.get(key);
	}
}
