import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Toast } from '../types/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private subject = new Subject<Toast>();
  toast$ = this.subject.asObservable();

  public show(toast: Toast) {
    this.subject.next(toast);
  }
}
