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
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import {
  Bookmark,
  BookmarkAddModalPayload,
  BookmarkCardEvent,
  BookmarkCardEventType,
  BookmarkFolder,
} from '../../shared/interfaces/bookmarks.interface';
import { BookmarksService } from '../../shared/services/bookmarks.service';
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
    private dialog: DialogService
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
        },
        enableClose: false,
      }
    );
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          switchMap((data) => {
            if (data) {
            }
            return EMPTY;
          })
        )
        .subscribe(() => {})
    );
  }

  handleCardEvent(event: BookmarkCardEvent) {
    switch (event.type) {
      case BookmarkCardEventType.favorite:
        this.bookmarkService.updateBookmark(event.bookmark.id, {
          favorite: !event.bookmark?.favorite,
        });
        break;
      case BookmarkCardEventType.edit:
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
              this.bookmarkService.deleteBookmark(bookmark.id);
            }
          })
        )
        .subscribe(() => {})
    );
  }
}
