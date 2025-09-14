import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { KeyboardComponent } from './components/keyboard/keyboard.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AsyncPipe } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';

@Component({
  selector: 'app-root',
  imports: [FontAwesomeModule, AsyncPipe, SettingsComponent, GameBoardComponent, KeyboardComponent],
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
    this.startNewGame();
  }

  private async startNewGame() {
    await this.gameService.newGame(this.wordLength, this.maxGuesses);
  }
}
