import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import {
  StorageService,
  STORAGE_INSTANCE,
} from '@app/services/storage/storage.service';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { BookmarksAddFolderComponent } from './components/modals/bookmarks-add-folder/bookmarks-add-folder.component';
import { ALL_BOOKMARKS_FOLDER } from './shared/config/bookmarks.config';
import {
  Bookmark,
  BookmarkFolder,
  BookmarkFolderAddModalPayload,
} from './shared/interfaces/bookmarks.interface';
import {
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
export class BookmarksComponent implements OnInit, OnDestroy {
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
  private subs = new SubSink();
  constructor(
    private store: Store,
    private dialog: DialogService,
    private menu: MenuService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.getBookmarkFolders();
    this.getBookmarks();
    this.updateBookmarksInIDB();
    this.updateBookmarkFoldersInIDB();
    this.isMenuOpen$ = this.menu.isMenuOpen$;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  closeMenu() {
    this.menu.closeMenu();
  }

  handleSelectFolder(folder: BookmarkFolder) {
    if (folder) {
      this.bookmarkLoadingSubject.next(true);
      this.store.dispatch(new SetActiveBookmarkFolder(folder));
      const sub = this.store.dispatch(new GetBookmarks(folder.id)).subscribe(
        () => {
          this.bookmarkLoadingSubject.next(false);
        },
        () => {
          this.bookmarkLoadingSubject.next(false);
        }
      );
      this.subs.add(sub);
    }
  }
  handleEditFolder(folder: BookmarkFolder) {
    this.dialog.open<BookmarkFolderAddModalPayload>(
      BookmarksAddFolderComponent,
      {
        size: 'sm',
        data: {
          folder,
          type: ModalOperationType.UPDATE,
        },
        enableClose: false,
      }
    );
  }

  handleCreateFolder() {
    this.dialog.open<BookmarkFolderAddModalPayload>(
      BookmarksAddFolderComponent,
      {
        size: 'sm',
        data: {
          type: ModalOperationType.CREATE,
        },
        enableClose: false,
      }
    );
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

  private updateBookmarksInIDB() {
    const sub = this.allBookmarks$
      .pipe(
        filter((res) => res.length > 0),
        tap((bookmarks) => {
          bookmarks.forEach((data) => {
            this.storage.setItem(
              STORAGE_INSTANCE.BOOKMARKS,
              data.folder.id,
              bookmarks.filter(({ folder: { id } }) => id === data.folder.id)
            );
          });
        })
      )
      .subscribe();
    this.subs.add(sub);
  }
  private updateBookmarkFoldersInIDB() {
    const sub = this.allBookmarkFolders$
      .pipe(
        filter((res) => res.length > 0),
        tap((bookmarks) => {
          this.storage.setItem(
            STORAGE_INSTANCE.FOLDERS,
            'bookmarks',
            bookmarks
          );
        })
      )
      .subscribe();
    this.subs.add(sub);
  }
}
