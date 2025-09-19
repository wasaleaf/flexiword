import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Row } from '../../types/row';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, OnDestroy {
  @Input()
  public rows: Row[] = [];
  @Input()
  public wordLength: number = 5;

  public popStates: boolean[][] = [];
  public shakeRow: number | null = null;
  public flipRow: number | null = null;
  public winRow: number | null = null;

  private sub = new Subscription();

  public constructor(private gameService: GameService) { }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
    // TODO handle setTimeout
  }

  public ngOnInit() {
    this.popStates = this.rows.map(r => r.cells.map(_ => false));

    this.sub.add(
      this.gameService.pop$.subscribe(({ row, col }) => {
        this.popStates[row][col] = true;
        setTimeout(() => this.popStates[row][col] = false, 200);
      })
    );

    this.sub.add(
      this.gameService.shake$.subscribe(({ row }) => {
        this.shakeRow = row;
        setTimeout(() => this.shakeRow = null, 600);
      })
    );

    this.sub.add(
      this.gameService.flip$.subscribe(({ row }) => {
        this.flipRow = row;
        setTimeout(() => this.flipRow = null, 3000);
      })
    );

    this.sub.add(
    this.gameService.win$.subscribe(({ row }) => {
      this.winRow = row;
      setTimeout(() => this.winRow = null, 2000);
    })
  );
  }
}
