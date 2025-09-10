import { Injectable } from '@angular/core';
import { LetterState } from '../enums/letter-state';
import { Row } from '../types/row';
import { WordService } from './word.service';
import { BehaviorSubject } from 'rxjs';
import { WordOfDayCacheKey } from '../utils/cache-helpers';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private rowSubject = new BehaviorSubject<Row[]>([]);
  public wordLength = 5;
  public maxGuesses = 6;
  public targetWord = '';
  public rows: Row[] = [];
  public rows$ = this.rowSubject.asObservable();
  public currentRowIndex = 0;
  public currentCellIndex = 0;
  public gameOver = false;
  public win = false;
  public keyStates: Record<string, LetterState> = {};

  public constructor(private wordService: WordService) { }

  public async newGame(length: number, maxGuesses: number) {
    this.wordLength = length;
    this.maxGuesses = maxGuesses;

    this.rows = Array.from({ length: this.maxGuesses }, () => new Row(this.wordLength));
    this.rowSubject.next([...this.rows]);
    this.currentRowIndex = 0;
    this.currentCellIndex = 0;
    this.gameOver = false;
    this.win = false;
    this.keyStates = {};

    const dayKey = WordOfDayCacheKey(length);
    const stored = localStorage.getItem(dayKey);

    if (stored) {
      this.targetWord = stored;
    }
    else {
      try {
        this.targetWord = await this.wordService.getWordOfDay(this.wordLength);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  public handleKeyPress(key: string) {
    if (this.gameOver) return;
    key = key.toUpperCase();

    if (key === 'ENTER') {
      this.submitGuess();
    }
    else if (key === 'BACKSPACE') {
      this.removeLetter();
    }
    else if (/^[A-Z]$/.test(key)) {
      this.addLetter(key);
    }
  }

  private addLetter(letter: string) {
    if (this.gameOver) return;
    if (this.currentCellIndex >= this.wordLength) return;

    const row = this.rows[this.currentRowIndex];
    row.cells[this.currentCellIndex].letter = letter;
    row.cells[this.currentCellIndex].state = LetterState.Tbd;
    this.rowSubject.next([...this.rows]);
    this.currentCellIndex++;
  }

  private removeLetter() {
    if (this.gameOver) return;
    if (this.currentCellIndex === 0) return;

    this.currentCellIndex--;
    const row = this.rows[this.currentRowIndex];
    row.cells[this.currentCellIndex].reset();
    this.rowSubject.next([...this.rows]);
  }

  private async submitGuess() {
    if (this.gameOver) return;
    if (this.currentCellIndex < this.wordLength) {
      // TODO make a toast message saying not enough letters
      return;
    }

    const row = this.rows[this.currentRowIndex];
    const guess = row.word.toLowerCase();
    const isValid = await this.wordService.isValidWord(guess);
    if (!isValid) {
      // TODO make a toast message saying invalid word
      return;
    }

    // TODO add submit logic
  }
}
