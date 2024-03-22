import { TestBed } from '@angular/core/testing';

import { NodeserviceService } from './nodeservice.service';

describe('NodeserviceService', () => {
  let service: NodeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
