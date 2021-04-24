import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BookmarkMetaData } from '../../../../shared/interfaces/bookmarks.interface';

@Component({
  selector: 'app-bookmark-add-preview',
  templateUrl: './bookmark-add-preview.component.html',
  styleUrls: ['./bookmark-add-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkAddPreviewComponent implements OnInit {
  @Input() meta: BookmarkMetaData;
  @Input() title: string;
  @Input() description: string;
  constructor() {}

  ngOnInit(): void {}
}
