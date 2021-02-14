import { TestBed } from '@angular/core/testing';

import { BookmarkMenuService } from './bookmark-menu.service';

describe('BookmarkMenuService', () => {
  let service: BookmarkMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
