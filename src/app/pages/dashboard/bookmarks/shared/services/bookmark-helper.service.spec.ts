import { TestBed } from '@angular/core/testing';

import { BookmarkHelperService } from './bookmark-helper.service';

describe('BookmarkHelperService', () => {
  let service: BookmarkHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
