import { Component, EventEmitter, model, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

import { GameSettings } from '../../types/settings';

@Component({
  selector: 'app-settings',
  imports: [FontAwesomeModule, FormsModule, MatSliderModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public closeIcon = faX;
  public dialogOpen = model.required<boolean>();
  public settings = model.required<GameSettings>();
  @Output() newGameRequested = new EventEmitter<void>();

  public wordLengthMin = 5;
  public wordLengthMax = 7;
  public maxGuessMin = 1;
  public maxGuessMax = 10;

  public updateDialogOpen(state: boolean): void {
    this.dialogOpen.update(_ => state);
  }

  public updateTheme() {
    document.documentElement.setAttribute('theme', this.settings().theme!);
    this.updateSettings();
  }

  public updateColor(isCorrect: boolean) {
    if (isCorrect) {
      document.documentElement.style.setProperty('--correct-color', this.settings().correctColor);
    }
    else {
      document.documentElement.style.setProperty('--present-color', this.settings().presentColor);
    }
    this.updateSettings();
  }

  public triggerNewGame() {
    this.updateSettings();
    this.newGameRequested.emit();
  }

  private updateSettings() {
    this.settings().save();
  }
}
