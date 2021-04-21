import { TestBed } from '@angular/core/testing';

import { SharePopupService } from './share-popup.service';

describe('SharePopupService', () => {
  let service: SharePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
