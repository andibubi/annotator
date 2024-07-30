import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAnnotation } from 'app/entities/annotation/annotation.model';
import { AnnotationService } from 'app/entities/annotation/service/annotation.service';
import { AnnotationElementService } from '../service/annotation-element.service';
import { IAnnotationElement } from '../annotation-element.model';
import { AnnotationElementFormService } from './annotation-element-form.service';

import { AnnotationElementUpdateComponent } from './annotation-element-update.component';

describe('AnnotationElement Management Update Component', () => {
  let comp: AnnotationElementUpdateComponent;
  let fixture: ComponentFixture<AnnotationElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let annotationElementFormService: AnnotationElementFormService;
  let annotationElementService: AnnotationElementService;
  let annotationService: AnnotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnnotationElementUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AnnotationElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnnotationElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    annotationElementFormService = TestBed.inject(AnnotationElementFormService);
    annotationElementService = TestBed.inject(AnnotationElementService);
    annotationService = TestBed.inject(AnnotationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Annotation query and add missing value', () => {
      const annotationElement: IAnnotationElement = { id: 456 };
      const annotation: IAnnotation = { id: 10693 };
      annotationElement.annotation = annotation;

      const annotationCollection: IAnnotation[] = [{ id: 28788 }];
      jest.spyOn(annotationService, 'query').mockReturnValue(of(new HttpResponse({ body: annotationCollection })));
      const additionalAnnotations = [annotation];
      const expectedCollection: IAnnotation[] = [...additionalAnnotations, ...annotationCollection];
      jest.spyOn(annotationService, 'addAnnotationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ annotationElement });
      comp.ngOnInit();

      expect(annotationService.query).toHaveBeenCalled();
      expect(annotationService.addAnnotationToCollectionIfMissing).toHaveBeenCalledWith(
        annotationCollection,
        ...additionalAnnotations.map(expect.objectContaining),
      );
      expect(comp.annotationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const annotationElement: IAnnotationElement = { id: 456 };
      const annotation: IAnnotation = { id: 5232 };
      annotationElement.annotation = annotation;

      activatedRoute.data = of({ annotationElement });
      comp.ngOnInit();

      expect(comp.annotationsSharedCollection).toContain(annotation);
      expect(comp.annotationElement).toEqual(annotationElement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnotationElement>>();
      const annotationElement = { id: 123 };
      jest.spyOn(annotationElementFormService, 'getAnnotationElement').mockReturnValue(annotationElement);
      jest.spyOn(annotationElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ annotationElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: annotationElement }));
      saveSubject.complete();

      // THEN
      expect(annotationElementFormService.getAnnotationElement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(annotationElementService.update).toHaveBeenCalledWith(expect.objectContaining(annotationElement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnotationElement>>();
      const annotationElement = { id: 123 };
      jest.spyOn(annotationElementFormService, 'getAnnotationElement').mockReturnValue({ id: null });
      jest.spyOn(annotationElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ annotationElement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: annotationElement }));
      saveSubject.complete();

      // THEN
      expect(annotationElementFormService.getAnnotationElement).toHaveBeenCalled();
      expect(annotationElementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnnotationElement>>();
      const annotationElement = { id: 123 };
      jest.spyOn(annotationElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ annotationElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(annotationElementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAnnotation', () => {
      it('Should forward to annotationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(annotationService, 'compareAnnotation');
        comp.compareAnnotation(entity, entity2);
        expect(annotationService.compareAnnotation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
