import { Component, OnInit } from '@angular/core';

import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  public messages: string[] = [];

  public constructor(private toastService: ToastService) { }

  public ngOnInit() {
    this.toastService.messages$.subscribe(message => {
      this.messages.push(message);
      setTimeout(() => {
        this.messages = this.messages.filter(msg => msg !== message);
      }, 2000);
    });
  }
}
