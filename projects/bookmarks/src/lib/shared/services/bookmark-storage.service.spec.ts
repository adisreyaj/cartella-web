import { TestBed } from '@angular/core/testing';

import { BookmarkStorageService } from './bookmark-storage.service';

describe('BookmarkStorageService', () => {
  let service: BookmarkStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
