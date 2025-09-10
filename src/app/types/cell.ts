import { LetterState } from "../enums/letter-state";

export interface Cell {
    letter: string;
    state: LetterState;
}