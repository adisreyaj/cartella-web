import { TestBed } from '@angular/core/testing';

import { HomeStorageService } from './home-storage.service';

describe('HomeStorageService', () => {
  let service: HomeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
