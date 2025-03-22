import { TestBed } from '@angular/core/testing';

import { ActiveModuleService } from './active-module.service';

describe('ActiveModuleService', () => {
  let service: ActiveModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
