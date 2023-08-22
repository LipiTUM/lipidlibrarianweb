import { TestBed } from '@angular/core/testing';

import { SynonymTableService } from './synonym-table.service';


describe('SynonymTableService', () => {
  let service: SynonymTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynonymTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
