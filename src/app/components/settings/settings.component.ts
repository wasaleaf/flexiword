import { Component, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings',
  imports: [FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public closeIcon = faX;
  public dialogOpen = model<boolean>(false);

  public updateDialogOpen(state: boolean): void {
    this.dialogOpen.update(_ => state);
  }
}
