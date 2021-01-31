import { TestBed } from '@angular/core/testing';

import { MetaExtractorService } from './meta-extractor.service';

describe('MetaExtractorService', () => {
  let service: MetaExtractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaExtractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
