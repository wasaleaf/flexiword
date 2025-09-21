import { Injectable } from '@angular/core';

import { LetterState } from '../enums/letter-state';
import { Row } from '../types/row';
import { WordService } from './word.service';
import { WordOfDayCacheKey } from '../utils/cache-helpers';
import { ToastService } from './toast.service';
import { KeyStateService } from './key-state.service';
import { GameEventsService } from './game-events.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public wordLength = 5;
  public rows: Row[] = [];
  public gameOver = false;
  public win = false;

  private targetWord = '';
  private maxGuesses = 6;
  private currentRowIndex = 0;
  private currentCellIndex = 0;


  public constructor(
    private wordService: WordService,
    private toastService: ToastService,
    private keyStateService: KeyStateService,
    private gameEventsService: GameEventsService) { }

  public async newGame(length: number, maxGuesses: number) {
    this.wordLength = length;
    this.maxGuesses = maxGuesses;

    this.rows = Array.from({ length: this.maxGuesses }, () => new Row(this.wordLength));
    this.currentRowIndex = 0;
    this.currentCellIndex = 0;
    this.gameOver = false;
    this.win = false;

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

  public onRowRevealed(rowIndex: number) {
    this.rows[rowIndex].cells.forEach(cell => {
      this.keyStateService.setKeyState(cell.letter.toLowerCase(), cell.state);
    });
  }

  public addLetter(letter: string) {
    if (this.gameOver) return;
    if (this.currentCellIndex >= this.wordLength) return;

    const row = this.rows[this.currentRowIndex];
    row.cells[this.currentCellIndex].letter = letter;
    row.cells[this.currentCellIndex].state = LetterState.Tbd;
    this.gameEventsService.pop(this.currentRowIndex, this.currentCellIndex);
    this.currentCellIndex++;
  }

  public removeLetter() {
    if (this.gameOver) return;
    if (this.currentCellIndex === 0) return;

    this.currentCellIndex--;
    const row = this.rows[this.currentRowIndex];
    row.cells[this.currentCellIndex].reset();
  }

  public async submitGuess() {
    if (this.gameOver) return;
    if (this.currentCellIndex < this.wordLength) {
      this.gameEventsService.shake(this.currentRowIndex);
      this.toastService.show("Not enough letters");
      return;
    }

    const row = this.rows[this.currentRowIndex];
    const guess = row.word.toLowerCase();
    const isValid = await this.wordService.isValidWord(guess);
    if (!isValid) {
      this.gameEventsService.shake(this.currentRowIndex);
      this.toastService.show("Not a valid word");
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

    this.gameEventsService.flip(this.currentRowIndex);

    // Check for win
    if (states.every(state => state === LetterState.Correct)) {
      this.gameOver = true;
      this.win = true;
      this.gameEventsService.win(this.currentRowIndex);
      this.toastService.show("Nice!");
      return;
    }

    // Check for game over
    if (this.currentRowIndex === this.maxGuesses - 1) {
      this.gameOver = true;
      this.toastService.show(this.targetWord);
    }

    this.currentRowIndex++;
    this.currentCellIndex = 0;
  }
}
