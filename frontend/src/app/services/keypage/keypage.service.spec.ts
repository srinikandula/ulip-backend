import { TestBed } from '@angular/core/testing';

import { KeypageService } from './keypage.service';

describe('KeypageService', () => {
  let service: KeypageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeypageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
