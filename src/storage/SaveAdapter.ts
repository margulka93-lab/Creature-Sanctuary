export interface SaveAdapter {
  read(): string | null;
  write(save: string): void;
}
