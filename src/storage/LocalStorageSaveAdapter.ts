import type { SaveAdapter } from './SaveAdapter';

export const SAVE_KEY = 'creature-sanctuary.save';

export class LocalStorageSaveAdapter implements SaveAdapter {
  // Access happens inside read/write so unavailable storage can be caught by the save system.
  constructor(private readonly getStorage: () => Pick<Storage, 'getItem' | 'setItem'> = () => window.localStorage) {}

  read(): string | null {
    return this.getStorage().getItem(SAVE_KEY);
  }

  write(save: string): void {
    this.getStorage().setItem(SAVE_KEY, save);
  }
}
