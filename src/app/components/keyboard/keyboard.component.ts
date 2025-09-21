import { Component, HostListener, OnInit } from '@angular/core';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LetterState } from '../../enums/letter-state';
import { GameService } from '../../services/game.service';
import { KeyStateService } from '../../services/key-state.service';

@Component({
  selector: 'app-keyboard',
  imports: [FontAwesomeModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent implements OnInit {
  public deleteIcon = faDeleteLeft;
  public keyState: Record<string, LetterState> = {};
  public layout: string[][] = [];
  public disableKeyboard = false;

  public constructor(private gameService: GameService, private keyStateService: KeyStateService) {
    this.layout = keyStateService.layout;
  }

  public ngOnInit() {
    this.keyStateService.keyStates$.subscribe(state => {
      this.keyState = state;
    });
    this.gameService.guess$.subscribe(guessing => {
      this.disableKeyboard = guessing;
    });
  }

  @HostListener('window:keyup', ['$event'])
  public async proccessKey(input: string | KeyboardEvent) {
    if (this.disableKeyboard) return;
    
    let key: string;

    if (typeof input === 'string') {
      key = input.toUpperCase();
    }
    else {
      key = input.key.toUpperCase();
    }

    if (this.gameService.gameOver) return;

    if (key === 'ENTER') {
      await this.gameService.submitGuess();
    }
    else if (key === 'BACKSPACE') {
      this.gameService.removeLetter();
    }
    else if (/^[A-Z]$/.test(key)) {
      this.gameService.addLetter(key);
    }
  }
}
