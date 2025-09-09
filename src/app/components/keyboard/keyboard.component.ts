import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LetterState } from '../../enums/letter-state';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-keyboard',
  imports: [FontAwesomeModule],
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.scss'
})
export class KeyboardComponent {
  public deleteIcon = faDeleteLeft;
  @Input() keyState: Record<string, LetterState.Correct | LetterState.Present | LetterState.Absent | undefined> = {};
  @Output() keyPress = new EventEmitter<string>();

  protected row1 = ['q','w','e','r','t','y','u','i','o','p'];
  protected row2 = ['a','s','d','f','g','h','j','k','l'];
  protected row3 = ['z','x','c','v','b','n','m'];

  public onKey(key: string) {
    this.keyPress .emit(key);
  }

  @HostListener('window:keyup', ['$event'])
  public handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toUpperCase();

    if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
      this.keyPress.emit(key);
    }
  }
}
