import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { LetterState } from '../../enums/letter-state';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, OnDestroy {
  @Output() rowRevealed = new EventEmitter<number>();
  
  public popDuration = 200;
  public animationDuration = 600;
  public winDelayStagger = 100;
  public flipDelayStagger = 300;
  public LetterState = LetterState;
  public popStates: boolean[][] = [];
  public revealStates: boolean[][] = [];
  public shakeRow: number | null = null;
  public flipRow: number | null = null;
  public winRow: number | null = null;

  private sub = new Subscription();

  public constructor(public gameService: GameService) { }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
    // TODO handle setTimeout
  }

  public ngOnInit() {
    this.popStates = this.gameService.rows.map(r => r.cells.map(_ => false));
    this.revealStates = this.gameService.rows.map(r => r.cells.map(_ => false));

    this.sub.add(
      this.gameService.pop$.subscribe(({ row, col }) => {
        this.popStates[row][col] = true;
        setTimeout(() => this.popStates[row][col] = false, this.popDuration);
      })
    );

    this.sub.add(
      this.gameService.shake$.subscribe(({ row }) => {
        this.shakeRow = row;
        setTimeout(() => this.shakeRow = null, this.animationDuration);
      })
    );

    this.sub.add(
      this.gameService.flip$.subscribe(({ row }) => {
        this.flipRow = row;
        this.gameService.rows[row].cells.forEach((_, c) => {
          setTimeout(() => {
            this.revealStates[row][c] = true;
          }, (c * this.flipDelayStagger) + this.flipDelayStagger);
        });

        const totalDelay = this.animationDuration + (this.gameService.rows[row].cells.length - 1) * this.flipDelayStagger;
        setTimeout(() => {
          this.rowRevealed.emit(row);
          this.flipRow = null;
        }, totalDelay);
      })
    );

    this.sub.add(
      this.gameService.win$.subscribe(({ row }) => {
        this.winRow = row;
        this.gameService.rows[row].cells.forEach((_, c) => {
          setTimeout(() => {
            this.revealStates[row][c] = true;
          }, (c * this.flipDelayStagger) + this.flipDelayStagger);
        });
      })
    );
  }
}
