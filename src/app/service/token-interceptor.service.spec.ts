import { TestBed } from '@angular/core/testing';

import { TokenInterceptorService } from './jwt-interceptor.service';

describe('JwtInterceptorService', () => {
  let service: TokenInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
