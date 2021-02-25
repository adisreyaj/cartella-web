import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BookmarkHelperService } from '@app/bookmarks/shared/services/bookmark-helper.service';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { MoveToFolderComponent } from '@app/components/move-to-folder/move-to-folder.component';
import {
  FeatureType,
  ModalOperationType,
} from '@app/interfaces/general.interface';
import { MoveToFolderModalPayload } from '@app/interfaces/move-to-folder.interface';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { WithDestroy } from '@app/services/with-destory/with-destroy';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HomeState } from '../../../home/shared/store/states/home.state';
import {
  Bookmark,
  BookmarkAddModalPayload,
  BookmarkCardEvent,
  BookmarkCardEventType,
  BookmarkFolder,
} from '../../shared/interfaces/bookmarks.interface';
import {
  DeleteBookmark,
  GetBookmarks,
  UpdateBookmark,
} from '../../shared/store/actions/bookmarks.action';
import { BookmarkFolderState } from '../../shared/store/states/bookmark-folders.state';
import { BookmarkState } from '../../shared/store/states/bookmarks.state';
import { BookmarksAddComponent } from '../modals/bookmarks-add/bookmarks-add.component';

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrls: ['./bookmarks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksListComponent extends WithDestroy implements OnInit {
  @Input() user: User;
  @Input() isLoading = false;

  @Select(BookmarkFolderState.getActiveBookmarkFolder)
  activeFolder$: Observable<BookmarkFolder>;

  @Select(BookmarkState.getBookmarksShown)
  bookmarksShown$: Observable<Bookmark[]>;

  @Select(BookmarkState.getAllBookmarks)
  bookmarks$: Observable<Bookmark[]>;

  @Select(BookmarkState.getBookmarkFetched)
  bookmarkFetched$: Observable<boolean>;

  @Select(BookmarkFolderState.getAllBookmarkFolders)
  folders$: Observable<BookmarkFolder[]>;

  packagesCount = new Array(
    this.store.selectSnapshot(HomeState.getItemsCount)?.items?.bookmarks || 1
  ).fill('');

  constructor(
    private dialog: DialogService,
    private store: Store,
    private menu: MenuService,
    private helper: BookmarkHelperService
  ) {
    super();
  }

  get activeFolder() {
    return this.store.selectSnapshot(
      BookmarkFolderState.getActiveBookmarkFolder
    );
  }

  ngOnInit(): void {
    this.bookmarksShown$.subscribe((data) =>
      console.log('BOOKMARK SHOWN', data)
    );
  }

  toggleMenu() {
    this.menu.toggleMenu();
  }

  trackBy(_, { id }: { id: string }) {
    return id;
  }
  addNewBookmark() {
    const dialogRef = this.dialog.open<BookmarkAddModalPayload>(
      BookmarksAddComponent,
      {
        size: 'md',
        minHeight: 'unset',
        data: {
          folder: this.activeFolder,
          type: ModalOperationType.create,
        },
        enableClose: false,
      }
    );
  }

  handleCardEvent({ type, bookmark }: BookmarkCardEvent) {
    switch (type) {
      case BookmarkCardEventType.favorite:
        this.store.dispatch(
          new UpdateBookmark(bookmark.id, {
            favorite: !bookmark?.favorite,
          })
        );
        break;
      case BookmarkCardEventType.edit:
        this.handleEdit(bookmark);
        break;
      case BookmarkCardEventType.delete:
        this.handleDelete(bookmark);
        break;
      case BookmarkCardEventType.move:
        this.handleMoveToFolder(bookmark);
        break;
      case BookmarkCardEventType.share:
        break;

      default:
        break;
    }
  }

  private handleEdit(bookmark: Bookmark) {
    const dialogRef = this.dialog.open<BookmarkAddModalPayload>(
      BookmarksAddComponent,
      {
        size: 'md',
        minHeight: 'unset',
        data: {
          folder: this.activeFolder,
          bookmark,
          type: ModalOperationType.update,
        },
        enableClose: false,
      }
    );
  }
  private handleMoveToFolder(bookmark: Bookmark) {
    const dialogRef = this.dialog.open<MoveToFolderModalPayload>(
      MoveToFolderComponent,
      {
        size: 'sm',
        minHeight: 'unset',
        data: {
          type: FeatureType.bookmark,
          action: UpdateBookmark,
          item: bookmark,
          folders: this.folders$.pipe(
            map((folders) =>
              folders.filter(({ id }) => id !== bookmark.folder.id)
            )
          ),
        },
        enableClose: false,
      }
    );
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          switchMap(() => combineLatest([this.bookmarks$, this.folders$])),
          take(1),
          switchMap(([bookmarks, folders]) =>
            this.helper.updateBookmarksInIDB(bookmarks, folders)
          ),
          switchMap(() =>
            this.store.dispatch(
              new GetBookmarks(
                this.store.selectSnapshot(
                  BookmarkFolderState.getActiveBookmarkFolder
                )?.id
              )
            )
          )
        )
        .subscribe(() => {})
    );
  }

  private handleDelete(bookmark: Bookmark) {
    const dialogRef = this.dialog.open(DeletePromptComponent, {
      size: 'sm',
      minHeight: 'unset',
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
              this.store.dispatch(new DeleteBookmark(bookmark.id));
            }
          })
        )
        .subscribe(() => {})
    );
  }
}
