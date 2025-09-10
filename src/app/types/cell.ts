import { LetterState } from "../enums/letter-state";

export class Cell {
    letter: string;
    state: LetterState;

    public constructor(
        letter: string = '',
        state: LetterState = LetterState.Empty) {
        this.letter = letter;
        this.state = state;
    }

    public reset() {
        this.letter = '';
        this.state = LetterState.Empty;
    }
}