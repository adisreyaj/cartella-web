import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import {
  BookmarkAddModalPayload,
  BookmarkMetaData,
  BookmarkRequest,
} from '../../../shared/interfaces/bookmarks.interface';
import { BookmarksService } from '../../../shared/services/bookmarks.service';
import { MetaExtractorService } from '../../../shared/services/meta-extractor.service';
import { AddBookmark } from '../../../shared/store/actions/bookmarks.action';

@Component({
  selector: 'app-bookmarks-add',
  templateUrl: './bookmarks-add.component.html',
  styleUrls: ['./bookmarks-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksAddComponent implements OnInit, OnDestroy {
  @ViewChild('bookmarkURL') bookmarkURLRef: ElementRef;
  bookmarkURL = new FormControl('', [Validators.required]);
  bookmarkName = new FormControl('', [Validators.required]);
  bookmarkDescription = new FormControl('', [Validators.required]);

  private metaDataSubject = new BehaviorSubject<BookmarkMetaData>(null);
  metaData$ = this.metaDataSubject.pipe();
  meta: BookmarkMetaData;

  private isLoadingSubject = new Subject<boolean>();
  isLoading$ = this.isLoadingSubject.pipe();

  private subs = new SubSink();
  constructor(
    public ref: DialogRef<BookmarkAddModalPayload>,
    private bookmarkService: BookmarksService,
    private metaExtractorService: MetaExtractorService,
    private store: Store
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.bookmarkURL) {
      this.bookmarkURLRef?.nativeElement?.focus();
    }
  }

  fetchOrAdd(meta: BookmarkMetaData) {
    if (meta) {
      const data = {
        ...meta,
        name: this.bookmarkName.value,
        description: this.bookmarkDescription.value,
      };
      this.addBookmark(data);
    } else {
      this.getMeta(this.bookmarkURL.value);
    }
  }

  reset() {
    this.metaDataSubject.next(null);
    this.bookmarkURL.reset();
    this.bookmarkURL.enable();
    this.bookmarkName.reset();
    this.bookmarkDescription.reset();
  }

  private getMeta(url: string) {
    this.metaDataSubject.next(null);
    if (url) {
      this.isLoadingSubject.next(true);
      this.metaExtractorService
        .getMetaData(url)
        .pipe(
          tap((data: BookmarkMetaData) => {
            this.meta = data;
            this.bookmarkURL.disable();
            this.bookmarkName.setValue(data.title);
            this.bookmarkDescription.setValue(data.description);
            this.metaDataSubject.next(data);
          })
        )
        .subscribe((data) => {
          console.log(data);
          this.isLoadingSubject.next(false);
        });
    }
  }

  private addBookmark(data: BookmarkMetaData) {
    const bookmarkData: BookmarkRequest = {
      name: data?.title,
      description: data?.description,
      image: data?.image,
      site: data?.site,
      favicon: data?.icon,
      url: this.bookmarkURL.value,
      folderId: this.ref.data.folder.id,
      favorite: false,
      metadata: null,
      private: true,
      share: [],
    };
    this.store.dispatch(new AddBookmark(bookmarkData));
    this.ref.close();
  }

  close() {
    this.ref.close();
  }
}
