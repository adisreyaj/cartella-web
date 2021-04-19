import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalOperationType } from '@app/interfaces/general.interface';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { DialogRef } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  BookmarkAddModalPayload,
  BookmarkMetaData,
  BookmarkRequest,
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
export class BookmarksAddComponent
  extends WithDestroy
  implements OnInit, AfterViewInit {
  @ViewChild('bookmarkURL') bookmarkURLRef: ElementRef;

  bookmarkFormControls = {
    url: new FormControl('', [
      Validators.required,
      Validators.pattern(
        new RegExp(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g
        )
      ),
    ]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    site: new FormControl('', [Validators.required]),
  };
  meta: BookmarkMetaData;

  private metaDataSubject = new BehaviorSubject<BookmarkMetaData>(null);
  metaData$ = this.metaDataSubject.pipe(tap((data) => (this.meta = data)));

  private isLoadingSubject = new Subject<boolean>();
  isLoading$ = this.isLoadingSubject.pipe();

  constructor(
    public ref: DialogRef<BookmarkAddModalPayload>,
    private metaExtractorService: MetaExtractorService,
    private store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.ref.data.type === ModalOperationType.update) {
      const {
        description,
        name,
        image,
        site,
        url,
        favicon,
      } = this.ref.data.bookmark;
      this.metaDataSubject.next({
        description,
        title: name,
        image,
        favicon,
        site,
      });
      this.bookmarkFormControls.url.disable();
      this.bookmarkFormControls.description.setValue(description);
      this.bookmarkFormControls.name.setValue(name);
      this.bookmarkFormControls.site.setValue(site);
      this.bookmarkFormControls.url.setValue(url);
    }
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
          this.isLoadingSubject.next(false);
        });
    }
  }

  private addBookmark(data: BookmarkMetaData) {
    const bookmarkData: BookmarkRequest = {
      name: this.bookmarkFormControls.name.value,
      description: this.bookmarkFormControls.description.value,
      image: data?.image,
      site: this.bookmarkFormControls.site.value,
      favicon: data?.favicon,
      url: this.bookmarkFormControls.url.value,
      folderId: this.ref.data.folder.id,
      favorite: false,
      metadata: null,
      private: true,
      domain: data.domain,
    };
    if (this.ref.data.type === ModalOperationType.create) {
      this.store.dispatch(new AddBookmark(bookmarkData));
    } else if (this.ref.data.type === ModalOperationType.update) {
      const bookmarkUpdatedData = {
        name: this.bookmarkFormControls.name.value,
        description: this.bookmarkFormControls.description.value,
        site: this.bookmarkFormControls.site.value,
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
