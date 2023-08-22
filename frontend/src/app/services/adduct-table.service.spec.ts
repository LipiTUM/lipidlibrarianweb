import { TestBed } from '@angular/core/testing';

import { AdductTableService } from './adduct-table.service';


describe('AdductTableService', () => {
  let service: AdductTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdductTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
