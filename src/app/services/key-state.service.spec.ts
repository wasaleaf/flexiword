import { TestBed } from '@angular/core/testing';

import { KeyStateService } from './key-state.service';

describe('KeyStateService', () => {
  let service: KeyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
