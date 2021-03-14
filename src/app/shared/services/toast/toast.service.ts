import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: HotToastService) {}

  showSuccessToast(message: string) {
    this.toastr.success(message);
  }
  showErrorToast(message: string) {
    this.toastr.error(message);
  }
}
