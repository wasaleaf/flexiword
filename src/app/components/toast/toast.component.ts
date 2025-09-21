import { Component, OnInit } from '@angular/core';

import { ToastService } from '../../services/toast.service';
import { Toast } from '../../types/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  public toasts: Toast[] = [];

  public constructor(private toastService: ToastService) { }

  public ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);

      if (toast.timeout) {        
        setTimeout(() => {
          toast.closing = true;
          setTimeout(() => {
            this.toasts.shift();
          }, 500)
        }, toast.timeout);
      }
    });
  }
}
