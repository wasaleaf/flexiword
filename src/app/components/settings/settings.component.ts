import { Component, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FontAwesomeModule, FormsModule, MatSliderModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public closeIcon = faX;
  public dialogOpen = model<boolean>(false);
  public wordLength = model<number>(5);
  public maxGuesses = model<number>(6);
  public darkTheme: boolean = true;

  public wordLengthMin = 5;
  public wordLengthMax = 7;
  public maxGuessMin = 1;
  public maxGuessMax = 10;

  public updateDialogOpen(state: boolean): void {
    this.dialogOpen.update(_ => state);
  }
}
