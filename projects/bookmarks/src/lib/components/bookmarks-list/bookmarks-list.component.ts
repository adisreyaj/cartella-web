import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DeletePromptComponent } from '@cartella/components/delete-prompt/delete-prompt.component';
import { MoveToFolderComponent } from '@cartella/components/move-to-folder/move-to-folder.component';
import { SharePopupComponent } from '@cartella/components/share-popup/share-popup.component';
import { HomeState } from '@cartella/home/shared/store/states/home.state';
import { FeatureType, ModalOperationType } from '@cartella/interfaces/general.interface';
import { MoveToFolderModalPayload } from '@cartella/interfaces/move-to-folder.interface';
import { User } from '@cartella/interfaces/user.interface';
import { IDBSyncService } from '@cartella/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@cartella/services/menu/menu.service';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
import { DialogService } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { switchMap, tap } from 'rxjs/operators';
import {
  Bookmark,
  BookmarkAddModalPayload,
  BookmarkCardEvent,
  BookmarkCardEventType,
  BookmarkFolder,
} from '../../shared/interfaces/bookmarks.interface';
import { DeleteBookmark, GetBookmarks, UpdateBookmark } from '../../shared/store/actions/bookmarks.action';
import { BookmarkFolderState } from '../../shared/store/states/bookmark-folders.state';
import { BookmarksAddComponent } from '../modals/bookmarks-add/bookmarks-add.component';

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrls: ['./bookmarks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksListComponent extends WithDestroy implements OnInit {
  @Input() user!: User;
  @Input() isLoading = false;
  @Input() activeFolder!: BookmarkFolder;
  @Input() bookmarksShown!: Bookmark[];
  @Input() bookmarks!: Bookmark[];
  @Input() bookmarkFetched!: boolean;
  @Input() folders!: BookmarkFolder[];

  packagesCount = new Array(this.store.selectSnapshot(HomeState.getItemsCount)?.items?.bookmarks || 1).fill('');

  constructor(
    private dialog: DialogService,
    private store: Store,
    private menu: MenuService,
    private syncService: IDBSyncService,
  ) {
    super();
  }

  ngOnInit(): void {}

  toggleMenu() {
    this.menu.toggleMenu();
  }

  trackBy(_: number, { id }: { id: string }) {
    return id;
  }
  addNewBookmark() {
    const dialogRef = this.dialog.open<BookmarkAddModalPayload>(BookmarksAddComponent, {
      size: 'md',
      minHeight: 'unset',
      data: {
        folder: this.activeFolder,
        type: ModalOperationType.create,
      },
      enableClose: false,
    });
  }

  handleCardEvent({ type, bookmark }: BookmarkCardEvent) {
    switch (type) {
      case BookmarkCardEventType.favorite:
        this.store.dispatch(
          new UpdateBookmark(bookmark.id, {
            favorite: !bookmark?.favorite,
          }),
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
        this.handleShare(bookmark);
        break;

      default:
        break;
    }
  }

  private handleEdit(bookmark: Bookmark) {
    const dialogRef = this.dialog.open<BookmarkAddModalPayload>(BookmarksAddComponent, {
      size: 'md',
      minHeight: 'unset',
      data: {
        folder: this.activeFolder,
        bookmark,
        type: ModalOperationType.update,
      },
      enableClose: false,
    });
  }
  private handleMoveToFolder(bookmark: Bookmark) {
    const dialogRef = this.dialog.open<MoveToFolderModalPayload>(MoveToFolderComponent, {
      size: 'sm',
      minHeight: 'unset',
      data: {
        type: FeatureType.bookmark,
        action: UpdateBookmark,
        item: bookmark,
        folders: this.folders.filter(({ id }) => id !== bookmark.folder.id),
      },
      enableClose: false,
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          switchMap(() => this.syncService.syncItems(this.bookmarks, this.folders)),
          switchMap(() =>
            this.store.dispatch(
              new GetBookmarks(this.store.selectSnapshot(BookmarkFolderState.getActiveBookmarkFolder)?.id),
            ),
          ),
        )
        .subscribe(() => {}),
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
          }),
        )
        .subscribe(() => {}),
    );
  }
  private handleShare(bookmark: Bookmark) {
    const dialogRef = this.dialog.open(SharePopupComponent, {
      size: 'md',
      minHeight: 'unset',
      data: {
        entity: 'Bookmark',
        item: bookmark,
      },
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
            }
          }),
        )
        .subscribe(() => {}),
    );
  }
}
