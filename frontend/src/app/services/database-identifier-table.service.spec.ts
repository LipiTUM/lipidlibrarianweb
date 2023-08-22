import { TestBed } from '@angular/core/testing';

import { DatabaseIdentifierTableService } from './database-identifier-table.service';


describe('DatabaseIdentifierTableService', () => {
  let service: DatabaseIdentifierTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseIdentifierTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
