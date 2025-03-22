import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { postEditGuard } from './post-edit.guard';

describe('postEditGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => postEditGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
