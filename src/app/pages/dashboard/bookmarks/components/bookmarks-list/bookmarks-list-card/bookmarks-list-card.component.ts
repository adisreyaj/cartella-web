import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { take } from 'rxjs/operators';
import {
  Bookmark,
  BookmarkCardEvent,
  BookmarkCardEventType,
} from '../../../shared/interfaces/bookmarks.interface';
import { BookmarksService } from '../../../shared/services/bookmarks.service';

@Component({
  selector: 'app-bookmarks-list-card',
  templateUrl: './bookmarks-list-card.component.html',
  styleUrls: ['./bookmarks-list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksListCardComponent implements OnInit {
  @Input() bookmark: Bookmark;

  @Output() cardEvent = new EventEmitter<BookmarkCardEvent>();
  constructor(
    private clipboard: Clipboard,
    private bookmarkService: BookmarksService
  ) {}

  ngOnInit(): void {}

  handleFavoriteToggle(bookmark: Bookmark) {
    this.cardEvent.emit({
      type: BookmarkCardEventType.favorite,
      bookmark,
    });
  }
  handleEdit(bookmark: Bookmark) {
    this.cardEvent.emit({ type: BookmarkCardEventType.edit, bookmark });
  }
  handleDelete(bookmark: Bookmark) {
    this.cardEvent.emit({ type: BookmarkCardEventType.delete, bookmark });
  }
  handleShare(bookmark: Bookmark) {
    this.cardEvent.emit({ type: BookmarkCardEventType.share, bookmark });
  }

  updateView(bookmark: Bookmark) {
    this.bookmarkService.updateViews(bookmark.id).pipe(take(1)).subscribe();
  }

  handleCopyToClipboard(bookmark: Bookmark) {
    this.clipboard.copy(bookmark?.url);
  }
}
