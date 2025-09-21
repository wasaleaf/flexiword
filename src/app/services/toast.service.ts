import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private subject = new Subject<string>();
  messages$ = this.subject.asObservable();

  public show(message: string) {
    this.subject.next(message);
  }
}
