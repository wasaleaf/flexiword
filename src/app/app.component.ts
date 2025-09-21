import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GameService } from './services/game.service';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { SettingsComponent } from './components/settings/settings.component';
import { cleanUpWordOfDayStorage } from './utils/cache-helpers';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [FontAwesomeModule, SettingsComponent, GameBoardComponent, KeyboardComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public settingsIcon = faCog;
  public dialogOpen = false;
  public wordLength = 5; // default word length
  public maxGuesses = 6; // default number of guesses

  public constructor(public gameService: GameService) {}
  
  public ngOnInit() {
    cleanUpWordOfDayStorage();
    const stored = localStorage.getItem('theme');
    if (stored) {
      document.documentElement.setAttribute('theme', stored);
    }
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('theme', prefersDark ? 'dark' : 'light');
    }
    this.startNewGame();
  }

  public async startNewGame() {
    await this.gameService.newGame(this.wordLength, this.maxGuesses);
  }
}
