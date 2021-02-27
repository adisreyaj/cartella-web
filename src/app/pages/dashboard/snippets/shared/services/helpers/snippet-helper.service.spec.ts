import { TestBed } from '@angular/core/testing';

import { SnippetHelperService } from './snippet-helper.service';

describe('SnippetHelperService', () => {
  let service: SnippetHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnippetHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
