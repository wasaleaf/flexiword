import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LetterState } from '../enums/letter-state';

@Injectable({
  providedIn: 'root'
})
export class KeyStateService {
  private keyStatesSubject = new BehaviorSubject<Record<string, LetterState>>({});
  private keyStates: Record<string, LetterState> = {};
  public keyStates$ = this.keyStatesSubject.asObservable();

  public readonly layout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  public statePrecedence(state: LetterState) {
    return state === LetterState.Correct ? 3 : state === LetterState.Present ? 2 : state === LetterState.Absent ? 1 : 0;
  }

  public setKeyState(letter: string, state: LetterState) {
    if (state === LetterState.Tbd || state === LetterState.Empty) return;
    const currentState = this.keyStates[letter];
    if (this.statePrecedence(state) > this.statePrecedence(currentState)) {
      this.keyStates[letter] = state;
      this.keyStatesSubject.next({ ...this.keyStates });
    }
  }

  public resetState() {
    this.keyStates = {};

    this.layout.flat().forEach(letter => {
      this.keyStates[letter] = LetterState.Empty;
    });
    
    this.keyStatesSubject.next({ ...this.keyStates });
  }
}
