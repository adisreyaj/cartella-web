import { TestBed } from '@angular/core/testing';

import { PackageStorageService } from './package-storage.service';

describe('PackageStorageService', () => {
  let service: PackageStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackageStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
