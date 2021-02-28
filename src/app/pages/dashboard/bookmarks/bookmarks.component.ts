import { Component, OnInit } from '@angular/core';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { ToastService } from '@app/services/toast/toast.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, pluck, switchMap } from 'rxjs/operators';
import {
  ExplorerSidebarEvent,
  ExplorerSidebarEventType,
} from '../shared/components/explorer-sidebar/explorer-sidebar.component';
import { BookmarksAddFolderComponent } from './components/modals/bookmarks-add-folder/bookmarks-add-folder.component';
import { ALL_BOOKMARKS_FOLDER } from './shared/config/bookmarks.config';
import {
  Bookmark,
  BookmarkFolder,
  BookmarkFolderAddModalPayload,
} from './shared/interfaces/bookmarks.interface';
import { BookmarkHelperService } from './shared/services/bookmark-helper.service';
import {
  DeleteBookmarkFolder,
  GetBookmarkFolders,
  SetActiveBookmarkFolder,
} from './shared/store/actions/bookmark-folders.action';
import { GetBookmarks } from './shared/store/actions/bookmarks.action';
import { BookmarkFolderState } from './shared/store/states/bookmark-folders.state';
import { BookmarkState } from './shared/store/states/bookmarks.state';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss'],
})
export class BookmarksComponent extends WithDestroy implements OnInit {
  user: User;
  @Select(BookmarkState.getAllBookmarks)
  allBookmarks$: Observable<Bookmark[]>;

  @Select(BookmarkFolderState.getAllBookmarkFolders)
  allBookmarkFolders$: Observable<BookmarkFolder[]>;

  @Select(BookmarkState.getBookmarkFetched)
  bookmarkFetched$: Observable<boolean>;

  @Select(BookmarkFolderState.getBookmarkFolderFetched)
  bookmarkFolderFetched$: Observable<Bookmark[]>;

  @Select(BookmarkState.getBookmarksShown)
  bookmarksShown$: Observable<Bookmark[]>;

  @Select(BookmarkState.getActiveBookmark)
  activeBookmark$: Observable<Bookmark>;

  @Select(BookmarkFolderState.getAllBookmarkFolders)
  folders$: Observable<BookmarkFolder[]>;

  @Select(BookmarkFolderState.getActiveBookmarkFolder)
  activeFolder$: Observable<BookmarkFolder>;

  private bookmarkFolderLoadingSubject = new BehaviorSubject(false);
  bookmarkFolderLoading$ = this.bookmarkFolderLoadingSubject.pipe();

  private bookmarkLoadingSubject = new BehaviorSubject(false);
  bookmarkLoading$ = this.bookmarkLoadingSubject.pipe();

  isMenuOpen$: Observable<boolean>;
  constructor(
    private store: Store,
    private dialog: DialogService,
    private menu: MenuService,
    private toaster: ToastService,
    private helper: BookmarkHelperService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getBookmarkFolders();
    this.getBookmarks();
    this.updateBookmarksWhenActiveFolderChanges();
    this.updateBookmarksInIDB();
    this.updateBookmarkFoldersInIDB();
    this.isMenuOpen$ = this.menu.isMenuOpen$;
  }

  closeMenu() {
    this.menu.closeMenu();
  }

  handleSidebarEvent({ type, data }: ExplorerSidebarEvent) {
    switch (type) {
      case ExplorerSidebarEventType.select:
        this.handleSelectFolder(data);
        break;
      case ExplorerSidebarEventType.edit:
        this.handleEditFolder(data);
        break;
      case ExplorerSidebarEventType.createFolder:
        this.handleCreateFolder();
        break;
      case ExplorerSidebarEventType.delete:
        this.handleDeleteFolder(data);
        break;
      case ExplorerSidebarEventType.closeMenu:
        this.closeMenu();
        break;
    }
  }

  handleSelectFolder(folder: BookmarkFolder) {
    if (folder) {
      this.bookmarkLoadingSubject.next(true);
      this.store.dispatch(new SetActiveBookmarkFolder(folder));
    }
  }

  handleEditFolder(folder: BookmarkFolder) {
    this.dialog.open<BookmarkFolderAddModalPayload>(
      BookmarksAddFolderComponent,
      {
        size: 'sm',
        data: {
          folder,
          type: ModalOperationType.update,
        },
        enableClose: false,
      }
    );
  }

  handleDeleteFolder(folder: BookmarkFolder) {
    const dialogRef = this.dialog.open(DeletePromptComponent, {
      size: 'sm',
      minHeight: 'unset',
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          filter((allowDelete) => allowDelete),
          switchMap(() =>
            this.store.dispatch(new DeleteBookmarkFolder(folder.id))
          )
        )
        .subscribe(
          () => {
            this.toaster.showSuccessToast('Folder deleted successfully!');
          },
          (err) => {
            if (has(err, 'error.message')) {
              this.toaster.showErrorToast(err.error.message);
            } else {
              this.toaster.showErrorToast('Folder was not deleted!');
            }
          }
        )
    );
  }

  handleCreateFolder() {
    this.dialog.open<BookmarkFolderAddModalPayload>(
      BookmarksAddFolderComponent,
      {
        size: 'sm',
        data: {
          type: ModalOperationType.create,
        },
        enableClose: false,
      }
    );
  }

  private updateBookmarksWhenActiveFolderChanges() {
    const sub = this.activeFolder$
      .pipe(
        pluck('id'),
        switchMap((folderId) => this.store.dispatch(new GetBookmarks(folderId)))
      )
      .subscribe(
        () => {
          this.bookmarkLoadingSubject.next(false);
        },
        () => {
          this.bookmarkLoadingSubject.next(false);
        }
      );
    this.subs.add(sub);
  }

  private getBookmarks() {
    this.bookmarkLoadingSubject.next(true);
    const sub = this.store
      .dispatch(new GetBookmarks(ALL_BOOKMARKS_FOLDER.id))
      .subscribe(
        () => {
          this.bookmarkLoadingSubject.next(false);
        },
        () => {
          this.bookmarkLoadingSubject.next(false);
        }
      );

    this.subs.add(sub);
  }

  private getBookmarkFolders() {
    this.bookmarkFolderLoadingSubject.next(true);
    this.store.dispatch(new GetBookmarkFolders());
    const sub = this.store
      .dispatch(new SetActiveBookmarkFolder(ALL_BOOKMARKS_FOLDER))
      .subscribe(
        () => {
          this.bookmarkLoadingSubject.next(false);
        },
        () => {
          this.bookmarkLoadingSubject.next(false);
        }
      );

    this.subs.add(sub);
  }

  /**
   * Whenever bookmarks changes. get all bookmarks
   * and bookmark folders and update the data in IDB
   *
   * `take(1)` is added to `allBookmarkFolders$` as we don't want
   * `combineLatest` to emit when `allBookmarkFolders$` emits value
   */
  private updateBookmarksInIDB() {
    const sub = combineLatest([this.allBookmarks$, this.allBookmarkFolders$])
      .pipe(
        switchMap(([bookmarks, folders]) =>
          this.helper.updateBookmarksInIDB(bookmarks, folders)
        )
      )
      .subscribe();
    this.subs.add(sub);
  }

  private updateBookmarkFoldersInIDB() {
    const sub = this.allBookmarkFolders$
      .pipe(
        filter((res) => res.length > 0),
        switchMap((folders) => this.helper.updateBookmarkFoldersInDb(folders))
      )
      .subscribe();
    this.subs.add(sub);
  }
}
