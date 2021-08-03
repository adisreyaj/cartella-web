import { TestBed } from '@angular/core/testing';

import { EditorThemeService } from './editor-theme.service';

describe('EditorThemeService', () => {
  let service: EditorThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
