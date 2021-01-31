import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Bookmark,
  BookmarkCardEvent,
  BookmarkCardEventType,
} from '../../../shared/interfaces/bookmarks.interface';

@Component({
  selector: 'app-bookmarks-list-card',
  templateUrl: './bookmarks-list-card.component.html',
  styleUrls: ['./bookmarks-list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksListCardComponent implements OnInit {
  @Input() bookmark: Bookmark;

  @Output() cardEvent = new EventEmitter<BookmarkCardEvent>();
  constructor(private clipboard: Clipboard) {}

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

  handleCopyToClipboard(bookmark: Bookmark) {
    this.clipboard.copy(bookmark?.url);
  }
}
