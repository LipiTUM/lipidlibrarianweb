import { TestBed } from '@angular/core/testing';

import { StructureIdentifierTableService } from './structure-identifier-table.service';


describe('StructureIdentifierTableService', () => {
  let service: StructureIdentifierTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureIdentifierTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
