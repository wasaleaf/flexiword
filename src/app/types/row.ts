import { Cell } from "./cell";

export class Row {
    cells: Cell[];

    public constructor(wordLength: number) {
        this.cells = Array.from({ length: wordLength }, () => new Cell());
    }

    public reset() {
        this.cells.forEach(cell => cell.reset());
    }

    public get word(): string {
        return this.cells.map(c => c.letter).join('');
    }
}