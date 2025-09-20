import { Injectable } from '@angular/core';
import { LetterState } from '../enums/letter-state';
import { Row } from '../types/row';
import { WordService } from './word.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { WordOfDayCacheKey } from '../utils/cache-helpers';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private keyStatesSubject = new BehaviorSubject<Record<string, LetterState>>({});
  private popSubject = new Subject<{ row: number; col: number }>();
  private flipSubject = new Subject<{ row: number }>();
  private shakeSubject = new Subject<{ row: number }>();
  private winSubject = new Subject<{ row: number }>();
  public wordLength = 5;
  public maxGuesses = 6;
  public targetWord = '';
  public rows: Row[] = [];
  public currentRowIndex = 0;
  public currentCellIndex = 0;
  public gameOver = false;
  public win = false;
  public keyStates: Record<string, LetterState> = {};
  public pop$ = this.popSubject.asObservable();
  public flip$ = this.flipSubject.asObservable();
  public shake$ = this.shakeSubject.asObservable();
  public win$ = this.winSubject.asObservable();
  public keyStates$ = this.keyStatesSubject.asObservable();

  public constructor(private wordService: WordService) { }

  public async newGame(length: number, maxGuesses: number) {
    this.wordLength = length;
    this.maxGuesses = maxGuesses;

    this.rows = Array.from({ length: this.maxGuesses }, () => new Row(this.wordLength));
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

  public onRowRevealed(rowIndex: number) {
    this.rows[rowIndex].cells.forEach(cell => {
      this.setKeyState(cell.letter.toLowerCase(), cell.state);
    });
    this.keyStatesSubject.next({ ...this.keyStates });
  }

  private addLetter(letter: string) {
    if (this.gameOver) return;
    if (this.currentCellIndex >= this.wordLength) return;

    const row = this.rows[this.currentRowIndex];
    row.cells[this.currentCellIndex].letter = letter;
    row.cells[this.currentCellIndex].state = LetterState.Tbd;
    this.popSubject.next({ row: this.currentRowIndex, col: this.currentCellIndex });
    this.currentCellIndex++;
  }

  private removeLetter() {
    if (this.gameOver) return;
    if (this.currentCellIndex === 0) return;

    this.currentCellIndex--;
    const row = this.rows[this.currentRowIndex];
    row.cells[this.currentCellIndex].reset();
  }

  private async submitGuess() {
    if (this.gameOver) return;
    if (this.currentCellIndex < this.wordLength) {
      this.shakeSubject.next({ row: this.currentRowIndex });
      // TODO make a toast message saying not enough letters
      return;
    }

    const row = this.rows[this.currentRowIndex];
    const guess = row.word.toLowerCase();
    const isValid = await this.wordService.isValidWord(guess);
    if (!isValid) {
      this.shakeSubject.next({ row: this.currentRowIndex });
      // TODO make a toast message saying invalid word
      return;
    }

    const target = this.targetWord.split('');
    const guessArr = guess.split('');
    const freq: Record<string, number> = {};
    const states: LetterState[] = Array(this.wordLength).fill(LetterState.Absent);

    for (const letter of target) {
      freq[letter] = (freq[letter] ?? 0) + 1;
    }

    // Mark correct letter guesses
    guessArr.forEach((guessLetter, i) => {
      const targetLetter = target[i];

      if (guessLetter === targetLetter) {
        states[i] = LetterState.Correct;
        freq[guessLetter]!--;
      }
    });

    // Mark other letter guesses
    guessArr.forEach((guessLetter, i) => {
      if (states[i] === LetterState.Correct) return;

      const remaining = freq[guessLetter] ?? 0;
      if (remaining > 0) {
        states[i] = LetterState.Present;
        freq[guessLetter]!--;
      }
    });

    // Apply to board
    states.forEach((state, i) => {
      row.cells[i].state = state;
    });

    this.flipSubject.next({ row: this.currentRowIndex });

    // Check for win
    if (states.every(state => state === LetterState.Correct)) {
      this.gameOver = true;
      this.win = true;
      this.winSubject.next({ row: this.currentRowIndex });
      // TODO make a toast message based on the amount of guesses it took
      return;
    }

    // Check for game over
    if (this.currentRowIndex === this.maxGuesses) {
      this.gameOver = true;
      // TODO make a toast message that the game is over and what the word was
    }

    this.currentRowIndex++;
    this.currentCellIndex = 0;
  }

  private statePrecedence(state: LetterState) {
    return state === LetterState.Correct ? 3 : state === LetterState.Present ? 2 : state === LetterState.Absent ? 1 : 0;
  }

  private setKeyState(letter: string, state: LetterState) {
    if (state === LetterState.Tbd || state === LetterState.Empty) return;
    const currentState = this.keyStates[letter];
    if (this.statePrecedence(state) > this.statePrecedence(currentState)) {
      this.keyStates[letter] = state;
    }
  }
}
