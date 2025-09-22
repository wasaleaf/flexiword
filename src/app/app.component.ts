import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GameService } from './services/game.service';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { SettingsComponent } from './components/settings/settings.component';
import { cleanUpWordOfDayStorage } from './utils/cache-helpers';
import { ToastComponent } from './components/toast/toast.component';
import { GameSettings } from './types/settings';

@Component({
  selector: 'app-root',
  imports: [FontAwesomeModule, SettingsComponent, GameBoardComponent, KeyboardComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public settingsIcon = faCog;
  public dialogOpen = false;
  public settings: GameSettings = GameSettings.load();

  public constructor(public gameService: GameService) { }
  
  public ngOnInit() {
    cleanUpWordOfDayStorage();
    if (this.settings.theme) {
      document.documentElement.setAttribute('theme', this.settings.theme);
    }
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      document.documentElement.setAttribute('theme', theme);
      this.settings.theme = theme;
      this.settings.save();
    }
    document.documentElement.style.setProperty('--correct-color', this.settings.correctColor);
    document.documentElement.style.setProperty('--present-color', this.settings.presentColor);
    this.startNewGame();
  }

  public async startNewGame() {
    await this.gameService.newGame(this.settings.wordLength, this.settings.guessLimit);
  }
}
