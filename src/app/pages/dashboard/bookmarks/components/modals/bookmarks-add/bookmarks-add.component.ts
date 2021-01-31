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
  ModalOperationType,
} from '../../../shared/interfaces/bookmarks.interface';
import { MetaExtractorService } from '../../../shared/services/meta-extractor.service';
import {
  AddBookmark,
  UpdateBookmark,
} from '../../../shared/store/actions/bookmarks.action';

@Component({
  selector: 'app-bookmarks-add',
  templateUrl: './bookmarks-add.component.html',
  styleUrls: ['./bookmarks-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksAddComponent implements OnInit, OnDestroy {
  @ViewChild('bookmarkURL') bookmarkURLRef: ElementRef;

  bookmarkFormControls = {
    url: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    site: new FormControl('', [Validators.required]),
  };
  meta: BookmarkMetaData;

  private metaDataSubject = new BehaviorSubject<BookmarkMetaData>(null);
  metaData$ = this.metaDataSubject.pipe(tap((data) => (this.meta = data)));

  private isLoadingSubject = new Subject<boolean>();
  isLoading$ = this.isLoadingSubject.pipe();

  private subs = new SubSink();
  constructor(
    public ref: DialogRef<BookmarkAddModalPayload>,
    private metaExtractorService: MetaExtractorService,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (this.ref.data.type === ModalOperationType.UPDATE) {
      const { description, name, image, site, url } = this.ref.data.bookmark;
      this.metaDataSubject.next({
        description,
        title: name,
        image,
        site,
      });
      this.bookmarkFormControls.url.disable();
      this.bookmarkFormControls.description.setValue(description);
      this.bookmarkFormControls.name.setValue(name);
      this.bookmarkFormControls.site.setValue(site);
      this.bookmarkFormControls.url.setValue(url);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.bookmarkFormControls.url) {
      this.bookmarkURLRef?.nativeElement?.focus();
    }
  }

  fetchOrAdd(meta: BookmarkMetaData) {
    if (meta) {
      const data = {
        ...meta,
        name: this.bookmarkFormControls.name.value,
        description: this.bookmarkFormControls.description.value,
      };
      this.addBookmark(data);
    } else {
      this.getMeta(this.bookmarkFormControls.url.value);
    }
  }

  reset() {
    this.metaDataSubject.next(null);
    this.bookmarkFormControls.url.reset();
    this.bookmarkFormControls.url.enable();
    this.bookmarkFormControls.name.reset();
    this.bookmarkFormControls.description.reset();
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
            this.bookmarkFormControls.url.disable();
            this.bookmarkFormControls.name.setValue(data.title);
            this.bookmarkFormControls.site.setValue(data.site);
            this.bookmarkFormControls.description.setValue(data.description);
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
      url: this.bookmarkFormControls.url.value,
      folderId: this.ref.data.folder.id,
      favorite: false,
      metadata: null,
      private: true,
      share: [],
    };
    if (this.ref.data.type === ModalOperationType.CREATE) {
      this.store.dispatch(new AddBookmark(bookmarkData));
    } else if (this.ref.data.type === ModalOperationType.UPDATE) {
      const bookmarkUpdatedData = {
        name: data?.title,
        description: data?.description,
        site: data?.site,
      };
      this.store.dispatch(
        new UpdateBookmark(this.ref.data.bookmark.id, bookmarkUpdatedData)
      );
    }
    this.ref.close();
  }

  close() {
    this.ref.close();
  }
}
