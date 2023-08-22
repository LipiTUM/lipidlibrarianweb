import { TestBed } from '@angular/core/testing';

import { FragmentTableService } from './fragment-table.service';


describe('FragmentTableService', () => {
  let service: FragmentTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FragmentTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
