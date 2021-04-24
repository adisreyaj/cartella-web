import { TestBed } from '@angular/core/testing';

import { SnippetStorageService } from './snippet-storage.service';

describe('SnippetStorageService', () => {
  let service: SnippetStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnippetStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
