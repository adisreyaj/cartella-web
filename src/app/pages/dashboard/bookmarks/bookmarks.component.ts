import { Component, OnInit } from '@angular/core';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { StorageService } from '@app/services/storage/storage.service';
import { WithDestroy } from '@app/services/with-destory/with-destroy';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, pluck, switchMap, take, tap } from 'rxjs/operators';
import { BookmarksAddFolderComponent } from './components/modals/bookmarks-add-folder/bookmarks-add-folder.component';
import { ALL_BOOKMARKS_FOLDER } from './shared/config/bookmarks.config';
import {
  Bookmark,
  BookmarkFolder,
  BookmarkFolderAddModalPayload,
} from './shared/interfaces/bookmarks.interface';
import { BookmarkHelperService } from './shared/services/bookmark-helper.service';
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
    private storage: StorageService,
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
        tap((folder) => console.log('Active Folder', folder)),
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

  private updateBookmarksInIDB() {
    const sub = this.allBookmarks$
      .pipe(
        filter((res) => res.length > 0),
        switchMap((bookmarks) =>
          this.allBookmarkFolders$.pipe(
            take(1),
            map((folders) => ({ bookmarks, folders }))
          )
        ),
        switchMap(
          ({
            bookmarks,
            folders,
          }: {
            bookmarks: Bookmark[];
            folders: BookmarkFolder[];
          }) => this.helper.updateBookmarksInIDB(bookmarks, folders)
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
