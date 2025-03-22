import { TestBed } from '@angular/core/testing';

import { DashMenuService } from './dash-menu.service';

describe('DashMenuService', () => {
  let service: DashMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
