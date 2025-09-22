export type Theme = 'light' | 'dark';

export class GameSettings {
    wordLength: number = 5;
    guessLimit: number = 6;
    theme: Theme | null = null;
    correctColor: string = '#538d4e';
    presentColor: string = '#b59f3b';

    public static load(): GameSettings {
        const stored = localStorage.getItem('settings');
        if (stored) {
            const obj = JSON.parse(stored);
            return Object.assign(new GameSettings(), obj);
        }
        return new GameSettings();
    }

    public save(): void {
        localStorage.setItem('settings', JSON.stringify(this));
    }
}