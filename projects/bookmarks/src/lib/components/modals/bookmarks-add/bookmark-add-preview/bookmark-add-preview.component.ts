import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BookmarkMetaData } from '../../../../shared/interfaces/bookmarks.interface';

@Component({
  selector: 'app-bookmark-add-preview',
  templateUrl: './bookmark-add-preview.component.html',
  styleUrls: ['./bookmark-add-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkAddPreviewComponent implements OnInit {
  @Input() meta: BookmarkMetaData | null = null;
  @Input() title: string | null = null;
  @Input() description: string | null = null;
  constructor() {}

  ngOnInit(): void {}
}
