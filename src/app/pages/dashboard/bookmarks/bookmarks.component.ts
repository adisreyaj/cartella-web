import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { User } from '@app/interfaces/user.interface';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
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
  @Select(BookmarkState.getBookmarkFetched)
  bookmarkFetched$: Observable<boolean>;

  @Select(BookmarkFolderState.getBookmarkFolderFetched)
  bookmarkFolderFetched$: Observable<Bookmark[]>;

  @Select(BookmarkState.getBookmarksShown)
  bookmarksShown$: Observable<Bookmark[]>;

  @Select(BookmarkState.getActiveBookmark)
  activeBookmark$: Observable<Bookmark>;

  @Select(BookmarkFolderState.getBookmarkFoldersList)
  folders$: Observable<BookmarkFolder[]>;

  @Select(BookmarkFolderState.getActiveBookmarkFolder)
  activeFolder$: Observable<BookmarkFolder>;

  private bookmarkFolderLoadingSubject = new BehaviorSubject(false);
  bookmarkFolderLoading$ = this.bookmarkFolderLoadingSubject.pipe();

  private bookmarkLoadingSubject = new BehaviorSubject(false);
  bookmarkLoading$ = this.bookmarkLoadingSubject.pipe();

  private subs = new SubSink();
  constructor(private store: Store, private dialog: DialogService) {}

  ngOnInit(): void {
    this.getBookmarkFolders();
    this.getBookmarks();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  handleSelectFolder(folder: BookmarkFolder) {
    if (folder) {
      this.store.dispatch(new SetActiveBookmarkFolder(folder));
      this.store.dispatch(new GetBookmarks(folder.id));
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
    const folderState = this.store.selectSnapshot(
      (state) => state.snippetFolders
    );
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
}
