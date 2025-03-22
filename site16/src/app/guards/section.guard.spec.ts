import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sectionGuard } from './section.guard';

describe('sectionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sectionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
