import { TestBed } from '@angular/core/testing';

import { DelayApiInterceptor } from './delay-api.interceptor';

describe('DelayApiInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DelayApiInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DelayApiInterceptor = TestBed.inject(DelayApiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
