import { Component, OnInit } from '@angular/core';
import { ModalOperationType } from '@cartella/interfaces/general.interface';
import { LoggedUser } from '@cartella/interfaces/user.interface';
import { UserState } from '@cartella/store/states/user.state';
import { DeletePromptComponent, ExplorerSidebarEvent, ExplorerSidebarEventType } from '@cartella/ui/components';
import { IDBSyncService, MenuService, ToastService, WithDestroy } from '@cartella/ui/services';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, finalize, pluck, switchMap, withLatestFrom } from 'rxjs/operators';
import { BookmarksAddFolderComponent } from './components/modals/bookmarks-add-folder/bookmarks-add-folder.component';
import { ALL_BOOKMARKS_FOLDER } from './shared/config/bookmarks.config';
import { Bookmark, BookmarkFolder, BookmarkFolderAddModalPayload } from './shared/interfaces/bookmarks.interface';
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
  @Select(UserState.getLoggedInUser)
  user$!: Observable<LoggedUser>;
  @Select(BookmarkState.getAllBookmarks)
  allBookmarks$!: Observable<Bookmark[]>;

  @Select(BookmarkFolderState.getAllBookmarkFolders)
  allBookmarkFolders$!: Observable<BookmarkFolder[]>;

  @Select(BookmarkState.getBookmarkFetched)
  bookmarkFetched$!: Observable<boolean>;

  @Select(BookmarkFolderState.getBookmarkFolderFetched)
  bookmarkFolderFetched$!: Observable<Bookmark[]>;

  @Select(BookmarkState.getBookmarksShown)
  bookmarksShown$!: Observable<Bookmark[]>;

  @Select(BookmarkState.getActiveBookmark)
  activeBookmark$!: Observable<Bookmark>;

  @Select(BookmarkFolderState.getAllBookmarkFolders)
  folders$!: Observable<BookmarkFolder[]>;

  @Select(BookmarkFolderState.getActiveBookmarkFolder)
  activeFolder$!: Observable<BookmarkFolder>;

  private bookmarkFolderLoadingSubject = new BehaviorSubject(false);
  bookmarkFolderLoading$ = this.bookmarkFolderLoadingSubject.pipe();

  private bookmarkLoadingSubject = new BehaviorSubject(false);
  bookmarkLoading$ = this.bookmarkLoadingSubject.pipe();

  isMenuOpen$!: Observable<boolean>;
  constructor(
    private store: Store,
    private dialog: DialogService,
    private menu: MenuService,
    private toaster: ToastService,
    private syncService: IDBSyncService,
  ) {
    super();
  }

  ngOnInit(): void {
    const sub = this.getDataFromAPI()
      .pipe(switchMap(() => this.updateBookmarksWhenActiveFolderChanges()))
      .subscribe(() => {
        this.updateBookmarksInIDB();
        this.updateBookmarkFoldersInIDB();
      });
    this.isMenuOpen$ = this.menu.isMenuOpen$;
    this.subs.add(sub);
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
    this.dialog.open<BookmarkFolderAddModalPayload>(BookmarksAddFolderComponent, {
      size: 'sm',
      data: {
        folder,
        type: ModalOperationType.update,
      },
      enableClose: false,
    });
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
          switchMap(() => this.store.dispatch(new DeleteBookmarkFolder(folder.id))),
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
          },
        ),
    );
  }

  handleCreateFolder() {
    this.dialog.open<BookmarkFolderAddModalPayload>(BookmarksAddFolderComponent, {
      size: 'sm',
      data: {
        type: ModalOperationType.create,
      },
      enableClose: false,
    });
  }

  private getDataFromAPI() {
    this.bookmarkLoadingSubject.next(true);
    return forkJoin([this.getBookmarks(), this.getBookmarkFolders()]).pipe(
      switchMap(([bookmarks, folders]) =>
        forkJoin([this.syncService.syncItems(bookmarks, folders), this.syncService.syncFolders(folders)]),
      ),
      finalize(() => {
        this.bookmarkLoadingSubject.next(false);
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      }),
    );
  }

  private updateBookmarksWhenActiveFolderChanges() {
    return this.activeFolder$
      .pipe(
        pluck('id'),
        switchMap((folderId) => this.store.dispatch(new GetBookmarks(folderId))),
      )
      .pipe(
        finalize(() => {
          this.bookmarkLoadingSubject.next(false);
        }),
      );
  }

  private getBookmarks() {
    return (
      this.store
        .dispatch(new GetBookmarks(ALL_BOOKMARKS_FOLDER.id))
        // Get bookmarks from state
        .pipe(pluck('bookmarks', 'allBookmarks'))
    );
  }

  private getBookmarkFolders() {
    return this.store.dispatch(new GetBookmarkFolders()).pipe(
      switchMap(() => this.store.dispatch(new SetActiveBookmarkFolder(ALL_BOOKMARKS_FOLDER))),
      // Get bookmark folders from state
      pluck('bookmarkFolders', 'bookmarkFolders'),
    );
  }

  /**
   * Whenever bookmarks changes. get all bookmarks
   * and bookmark folders and update the data in IDB
   *
   * `take(1)` is added to `allBookmarkFolders$` as we don't want
   * `combineLatest` to emit when `allBookmarkFolders$` emits value
   */
  private updateBookmarksInIDB() {
    const sub = this.allBookmarks$
      .pipe(
        withLatestFrom(this.allBookmarkFolders$),
        switchMap(([bookmarks, folders]) => this.syncService.syncItems(bookmarks, folders)),
      )
      .subscribe();
    this.subs.add(sub);
  }

  private updateBookmarkFoldersInIDB() {
    const sub = this.allBookmarkFolders$
      .pipe(
        filter((res) => res.length > 0),
        switchMap((folders) => this.syncService.syncFolders(folders)),
      )
      .subscribe();
    this.subs.add(sub);
  }
}
