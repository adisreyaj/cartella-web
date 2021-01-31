import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  showSuccessToast(message: string) {
    this.toastr.success(message);
  }
  showErrorToast(message: string) {
    this.toastr.error(message);
  }
}
