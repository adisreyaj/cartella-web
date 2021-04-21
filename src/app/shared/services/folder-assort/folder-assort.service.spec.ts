import { TestBed } from '@angular/core/testing';

import { FolderAssortService } from './folder-assort.service';

describe('FolderAssortService', () => {
  let service: FolderAssortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolderAssortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
