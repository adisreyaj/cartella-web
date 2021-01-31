import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { User } from '@app/interfaces/user.interface';
import { DialogService } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import {
  Bookmark,
  BookmarkAddModalPayload,
  BookmarkCardEvent,
  BookmarkCardEventType,
  BookmarkFolder,
  ModalOperationType,
} from '../../shared/interfaces/bookmarks.interface';
import { BookmarksService } from '../../shared/services/bookmarks.service';
import {
  DeleteBookmark,
  UpdateBookmark,
} from '../../shared/store/actions/bookmarks.action';
import { BookmarksAddComponent } from '../modals/bookmarks-add/bookmarks-add.component';

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styleUrls: ['./bookmarks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksListComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() activeFolder: BookmarkFolder;
  @Input() folders: BookmarkFolder[];
  @Input() bookmarks: Bookmark[] = [];

  private subs = new SubSink();
  constructor(
    private bookmarkService: BookmarksService,
    private dialog: DialogService,
    private store: Store
  ) {}

  ngOnInit(): void {}
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  addNewBookmark() {
    const dialogRef = this.dialog.open<BookmarkAddModalPayload>(
      BookmarksAddComponent,
      {
        size: 'md',
        minHeight: 'unset',
        data: {
          folder: this.activeFolder,
          type: ModalOperationType.CREATE,
        },
        enableClose: false,
      }
    );
  }

  handleCardEvent(event: BookmarkCardEvent) {
    switch (event.type) {
      case BookmarkCardEventType.favorite:
        this.store.dispatch(
          new UpdateBookmark(event.bookmark.id, {
            favorite: !event.bookmark?.favorite,
          })
        );
        break;
      case BookmarkCardEventType.edit:
        this.handleEdit(event.bookmark);
        break;
      case BookmarkCardEventType.delete:
        this.handleDelete(event.bookmark);
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
          type: ModalOperationType.UPDATE,
        },
        enableClose: false,
      }
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
