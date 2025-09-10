import { Component, Input } from '@angular/core';
import { Row } from '../../types/row';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {
  @Input()
  public rows: Row[] = [];
  @Input()
  public wordLength: number = 5;
}
