import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '@app/services/toast/toast.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import {
  BookmarkFolder,
  BookmarkFolderAddModalPayload,
} from '../../../shared/interfaces/bookmarks.interface';
import {
  AddBookmarkFolder,
  UpdateBookmarkFolder,
} from '../../../shared/store/actions/bookmark-folders.action';

@Component({
  selector: 'app-bookmarks-add-folder',
  templateUrl: './bookmarks-add-folder.component.html',
  styleUrls: ['./bookmarks-add-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksAddFolderComponent
  extends WithDestroy
  implements OnInit, AfterViewInit {
  @ViewChild('folderNameRef') folderNameRef: ElementRef;

  folderName = new FormControl('', [Validators.required]);

  private savingSubject = new BehaviorSubject<boolean>(false);
  saving$ = this.savingSubject.pipe();
  constructor(
    public ref: DialogRef<BookmarkFolderAddModalPayload>,
    private toaster: ToastService,
    private store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    if (has(this.ref.data, 'folder')) {
      const { folder } = this.ref.data;
      this.folderName.setValue(folder?.name);
    }
  }

  ngAfterViewInit() {
    if (this.folderNameRef) {
      this.folderNameRef?.nativeElement?.focus();
    }
  }
  createOrUpdateFolder(folder: BookmarkFolder) {
    if (folder) {
      this.updateFolder(folder);
    } else {
      this.createFolder();
    }
  }

  async updateFolder(folder: BookmarkFolder) {
    this.savingSubject.next(true);
    const sub = this.store
      .dispatch(
        new UpdateBookmarkFolder(folder.id, {
          name: this.folderName.value,
        })
      )
      .subscribe(
        () => {
          this.savingSubject.next(false);
          this.toaster.showSuccessToast('Folder updated successfully!');
          this.ref.close();
        },
        () => {
          this.savingSubject.next(false);
          this.toaster.showErrorToast('Failed to update the folder!');
        }
      );
    this.subs.add(sub);
  }

  async createFolder() {
    this.savingSubject.next(true);
    const sub = this.store
      .dispatch(
        new AddBookmarkFolder({
          name: this.folderName.value,
          metadata: {},
          private: true,
          share: [],
        })
      )
      .subscribe(
        () => {
          this.savingSubject.next(false);
          this.toaster.showSuccessToast('Folder updated successfully!');
          this.ref.close();
        },
        (err) => {
          this.savingSubject.next(false);
          if (has(err, 'error.message')) {
            this.toaster.showErrorToast(err.error.message);
          } else {
            this.toaster.showErrorToast('Folder was not created!');
          }
        }
      );
    this.subs.add(sub);
  }

  close() {
    this.ref.close();
  }
}
