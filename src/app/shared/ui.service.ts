import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UIService {
  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message: any, action: any, duration: number) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
}
