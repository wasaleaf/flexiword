import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { LetterState } from '../../enums/letter-state';
import { GameEventsService } from '../../services/game-events.service';
import { Row } from '../../types/row';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit, OnDestroy {  
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
  @Output() rowRevealed = new EventEmitter<number>();
  @Input() rows: Row[] = [];
  @Input() wordLength: number = 0;
  @Input() win: boolean = false;

  private sub = new Subscription();
  private timeouts: number[] = [];

  public constructor(public gameEventsService: GameEventsService) { }

  public ngOnInit() {
    this.popStates = this.rows.map(r => r.cells.map(_ => false));
    this.revealStates = this.rows.map(r => r.cells.map(_ => false));

    this.sub.add(
      this.gameEventsService.pop$.subscribe(({ row, col }) => {
        this.popStates[row][col] = true;
        this.registerTimeout(() => this.popStates[row][col] = false, this.popDuration);
      })
    );

    this.sub.add(
      this.gameEventsService.shake$.subscribe(({ row }) => {
        this.shakeRow = row;
        this.registerTimeout(() => this.shakeRow = null, this.animationDuration);
      })
    );

    this.sub.add(
      this.gameEventsService.flip$.subscribe(({ row }) => {
        this.flipRow = row;
        this.rows[row].cells.forEach((_, c) => {
          this.registerTimeout(() => {
            this.revealStates[row][c] = true;
          }, (c * this.flipDelayStagger) + this.flipDelayStagger);
        });

        const totalDelay = this.animationDuration + (this.rows[row].cells.length - 1) * this.flipDelayStagger;
        this.registerTimeout(() => {
          this.rowRevealed.emit(row);
          this.flipRow = null;
        }, totalDelay);
      })
    );

    this.sub.add(
      this.gameEventsService.win$.subscribe(({ row }) => {
        this.winRow = row;
        this.rows[row].cells.forEach((_, c) => {
          this.registerTimeout(() => {
            this.revealStates[row][c] = true;
          }, (c * this.flipDelayStagger) + this.flipDelayStagger);
        });
      })
    );
  }

    public ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.timeouts.forEach(id => clearTimeout(id));
    this.timeouts = [];
  }

  private registerTimeout(fn: () => void, delay: number) {
    const id = window.setTimeout(() => {
      try {
        fn();
      }
      finally {
        this.timeouts = this.timeouts.filter(t => t !== id);
      }
    }, delay);

    this.timeouts.push(id);
  }
}
