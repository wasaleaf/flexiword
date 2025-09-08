import { LetterState } from "../enums/letter-state";

export interface Cell {
    char: string;
    state: LetterState;
}