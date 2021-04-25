import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Bookmark, UpdateBookmark } from '@cartella/bookmarks';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { Package, UpdatePackage } from '@cartella/packages';
import { ShareSnippet, UnShareSnippet } from '@cartella/snippets';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { Access, ShareTo } from '../../interfaces/share.interface';
import { ToastService } from '../../services/toast/toast.service';
import { SharePopupPayload } from './share-popup.interface';

@Component({
  selector: 'app-share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharePopupComponent implements OnInit {
  @ViewChild('emailInputRef') emailInputRef: ElementRef;
  emailInputControl = new FormControl('', [Validators.required, Validators.email]);
  accessInputControl = new FormControl(Access.read, [Validators.required]);
  accessLevels = Object.values(Access);
  shareTo: Array<ShareTo & { id?: string }> = [];
  sharedWith: Array<ShareTo & { id?: string }> = [];
  usersPluralMap = { '=0': 'users', '=1': 'user', other: 'users' };

  isShareListView$ = new BehaviorSubject(false);
  private savingSubject = new BehaviorSubject<boolean>(false);
  readonly saving$ = this.savingSubject.pipe();

  shareAction = {
    [FeatureType.bookmark]: (bookmark: Bookmark) => new UpdateBookmark(bookmark.id, { share: bookmark.share }),
    [FeatureType.snippet]: (id: string, shareTo: ShareTo[]) => new ShareSnippet(id, shareTo),
    [FeatureType.package]: (packageData: Package) => new UpdatePackage(packageData.id, { share: packageData.share }),
  };
  unShareAction = {
    [FeatureType.bookmark]: (bookmark: Bookmark) => new UpdateBookmark(bookmark.id, { share: bookmark.share }),
    [FeatureType.snippet]: (id: string, revoke: string[]) => new UnShareSnippet(id, revoke),
    [FeatureType.package]: (packageData: Package) => new UpdatePackage(packageData.id, { share: packageData.share }),
  };
  constructor(
    public ref: DialogRef<SharePopupPayload>,
    private toaster: ToastService,
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (this.ref.data.item.share?.length > 0) {
      this.sharedWith = this.ref.data.item.share.map(({ email, access, id }) => ({ id, email, access }));
    }
  }

  addToList() {
    if (this.emailInputControl.valid && this.accessInputControl.valid) {
      if (this.sharedWith.findIndex(({ email }) => email === this.emailInputControl.value) >= 0) {
        this.toaster.showErrorToast('Already shared with user!');
        return;
      }
      this.shareTo = [
        ...this.shareTo,
        {
          email: this.emailInputControl.value as string,
          access: this.accessInputControl.value as Access,
        },
      ];
      this.cdr.detectChanges();
      this.emailInputControl.reset();
      if (this.emailInputRef?.nativeElement) {
        (this.emailInputRef.nativeElement as HTMLInputElement).focus();
      }
    }
  }

  removeFromToBeSharedList(shareData: ShareTo) {
    this.shareTo = this.shareTo.filter(({ email }) => email !== shareData.email);
  }

  removeFromList(shareData: ShareTo & { id: string }) {
    if (this.checkIfUserAlreadyPresentInShareList(shareData.email)) {
      this.unshare(shareData);
    }
  }

  checkIfUserAlreadyPresentInShareList(userEmail: string) {
    if (this.sharedWith.findIndex(({ email }) => email === userEmail) >= 0) {
      return true;
    }
    return false;
  }

  unshare(shareData: ShareTo & { id: string }) {
    const revokeData = [shareData.id];
    const action = this.unShareAction[this.ref.data.entity];
    this.store.dispatch(action(this.ref.data.item.id, revokeData)).subscribe(
      () => {
        this.sharedWith = this.sharedWith.filter(({ email }) => email !== shareData.email);
        this.cdr.detectChanges();
        this.toaster.showSuccessToast('User removed from shared list!');
      },
      (err: Error) => {
        this.toaster.showErrorToast(err.message);
      }
    );
  }

  share() {
    if (this.shareTo?.length > 0) {
      const action = this.shareAction[this.ref.data.entity];
      this.store.dispatch(action(this.ref.data.item.id, this.shareTo)).subscribe(
        () => {
          this.shareTo = [];
          this.cdr.detectChanges();
          this.toaster.showSuccessToast('Shared successfully');
          this.ref.close();
        },
        (err: Error) => {
          this.toaster.showErrorToast(err.message);
        }
      );
    }
  }
}
