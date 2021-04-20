import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { Access, ShareTo } from '../../interfaces/share.interface';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePopupComponent implements OnInit {
  @ViewChild('emailInputRef') emailInputRef: ElementRef;
  emailInputControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  accessInputControl = new FormControl(Access.read, [Validators.required]);
  accessLevels = Object.values(Access);
  shareTo: ShareTo[] = [];

  private savingSubject = new BehaviorSubject<boolean>(false);
  readonly saving$ = this.savingSubject.pipe();
  constructor(
    public ref: DialogRef,
    private toaster: ToastService,
    private store: Store
  ) {}

  ngOnInit(): void {}

  addToList() {
    if (
      this.emailInputControl.valid &&
      this.accessInputControl.valid &&
      this.shareTo.findIndex(
        ({ email }) => email === this.emailInputControl.value
      ) < 0
    ) {
      this.shareTo = [
        ...this.shareTo,
        {
          email: this.emailInputControl.value as string,
          access: this.accessInputControl.value as Access,
        },
      ];
      this.emailInputControl.reset();
      if (this.emailInputRef?.nativeElement) {
        (this.emailInputRef.nativeElement as HTMLInputElement).focus();
      }
    }
  }

  removeFromList(index: number) {
    this.shareTo = this.shareTo.filter((_, i) => i === index);
  }

  share() {
    console.log(this.shareTo);
  }
}
