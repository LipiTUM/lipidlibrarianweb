import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationDocumentComponent } from './documentation-document.component';

describe('DocumentationDocumentComponent', () => {
  let component: DocumentationDocumentComponent;
  let fixture: ComponentFixture<DocumentationDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DocumentationDocumentComponent]
    });
    fixture = TestBed.createComponent(DocumentationDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
