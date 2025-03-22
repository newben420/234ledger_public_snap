import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { currentLoadGuard } from './current-load.guard';

describe('currentLoadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => currentLoadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
