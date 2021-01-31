import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastService } from '@app/services/toast/toast.service';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { SubSink } from 'subsink';
import {
  BookmarkFolder,
  BookmarkFolderAddModalPayload,
} from '../../../shared/interfaces/bookmarks.interface';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import {
  AddBookmarkFolder,
  DeleteBookmarkFolder,
  UpdateBookmarkFolder,
} from '../../../shared/store/actions/bookmark-folders.action';

@Component({
  selector: 'app-bookmarks-add-folder',
  templateUrl: './bookmarks-add-folder.component.html',
  styleUrls: ['./bookmarks-add-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksAddFolderComponent implements OnInit, OnDestroy {
  @ViewChild('folderNameRef') folderNameRef: ElementRef;
  folderName = new FormControl('', [Validators.required]);

  private subs = new SubSink();
  constructor(
    public ref: DialogRef<BookmarkFolderAddModalPayload>,
    private bookmarkService: BookmarksService,
    private toaster: ToastService,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (has(this.ref.data, 'folder')) {
      const { folder } = this.ref.data;
      this.folderName.setValue(folder?.name);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
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
    try {
      this.store.dispatch(
        new UpdateBookmarkFolder(folder.id, {
          name: this.folderName.value,
        })
      );
    } catch (error) {
      this.toaster.showErrorToast('Failed to update folder');
    }
  }

  async createFolder() {
    this.store
      .dispatch(
        new AddBookmarkFolder({
          name: this.folderName.value,
          metadata: {},
          private: true,
          share: {},
        })
      )
      .subscribe(
        () => {
          this.ref.close();
        },
        (err) => {
          if (has(err, 'error.message')) {
            this.toaster.showErrorToast(err.error.message);
          } else {
            this.toaster.showErrorToast('Folder was not created!');
          }
        }
      );
  }

  async deleteFolder(folder: BookmarkFolder) {
    this.store.dispatch(new DeleteBookmarkFolder(folder.id)).subscribe(
      () => {
        this.toaster.showSuccessToast('Folder deleted successfully!');
        this.ref.close();
      },
      (err) => {
        if (has(err, 'error.message')) {
          this.toaster.showErrorToast(err.error.message);
        } else {
          this.toaster.showErrorToast('Folder was not deleted!');
        }
      }
    );
  }

  close() {
    this.ref.close();
  }
}
