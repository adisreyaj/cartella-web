import { TestBed } from '@angular/core/testing';

import { SnippetsService } from './snippets.service';

describe('SnippetsService', () => {
  let service: SnippetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnippetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
