jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TextAnnotationElementService } from '../service/text-annotation-element.service';

import { TextAnnotationElementDeleteDialogComponent } from './text-annotation-element-delete-dialog.component';

describe('TextAnnotationElement Management Delete Component', () => {
  let comp: TextAnnotationElementDeleteDialogComponent;
  let fixture: ComponentFixture<TextAnnotationElementDeleteDialogComponent>;
  let service: TextAnnotationElementService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextAnnotationElementDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(TextAnnotationElementDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TextAnnotationElementDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TextAnnotationElementService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
