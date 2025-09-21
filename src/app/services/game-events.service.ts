import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameEventsService {
    private popSubject = new Subject<{ row: number; col: number }>();
    private flipSubject = new Subject<{ row: number }>();
    private shakeSubject = new Subject<{ row: number }>();
    private winSubject = new Subject<{ row: number }>();
  
    public pop$ = this.popSubject.asObservable();
    public flip$ = this.flipSubject.asObservable();
    public shake$ = this.shakeSubject.asObservable();
    public win$ = this.winSubject.asObservable();

    public pop(row: number, column: number) {
      this.popSubject.next({row: row, col: column});
    }

    public flip(row: number) {
      this.flipSubject.next({row: row});
    }

    public shake(row: number) {
      this.shakeSubject.next({row: row});
    }

    public win(row: number) {
      this.winSubject.next({row: row});
    }
}
