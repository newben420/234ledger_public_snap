import { TestBed } from '@angular/core/testing';

import { SiteUrlService } from './site-url.service';

describe('SiteUrlService', () => {
  let service: SiteUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
