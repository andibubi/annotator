import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAnnotation } from 'app/entities/annotation/annotation.model';
import { AnnotationService } from 'app/entities/annotation/service/annotation.service';
import { TextAnnotationElementService } from '../service/text-annotation-element.service';
import { ITextAnnotationElement } from '../text-annotation-element.model';
import { TextAnnotationElementFormService } from './text-annotation-element-form.service';

import { TextAnnotationElementUpdateComponent } from './text-annotation-element-update.component';

describe('TextAnnotationElement Management Update Component', () => {
  let comp: TextAnnotationElementUpdateComponent;
  let fixture: ComponentFixture<TextAnnotationElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let textAnnotationElementFormService: TextAnnotationElementFormService;
  let textAnnotationElementService: TextAnnotationElementService;
  let annotationService: AnnotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextAnnotationElementUpdateComponent],
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
      .overrideTemplate(TextAnnotationElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TextAnnotationElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    textAnnotationElementFormService = TestBed.inject(TextAnnotationElementFormService);
    textAnnotationElementService = TestBed.inject(TextAnnotationElementService);
    annotationService = TestBed.inject(AnnotationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Annotation query and add missing value', () => {
      const textAnnotationElement: ITextAnnotationElement = { id: 456 };
      const annotation: IAnnotation = { id: 10693 };
      textAnnotationElement.annotation = annotation;

      const annotationCollection: IAnnotation[] = [{ id: 28788 }];
      jest.spyOn(annotationService, 'query').mockReturnValue(of(new HttpResponse({ body: annotationCollection })));
      const additionalAnnotations = [annotation];
      const expectedCollection: IAnnotation[] = [...additionalAnnotations, ...annotationCollection];
      jest.spyOn(annotationService, 'addAnnotationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ textAnnotationElement });
      comp.ngOnInit();

      expect(annotationService.query).toHaveBeenCalled();
      expect(annotationService.addAnnotationToCollectionIfMissing).toHaveBeenCalledWith(
        annotationCollection,
        ...additionalAnnotations.map(expect.objectContaining),
      );
      expect(comp.annotationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const textAnnotationElement: ITextAnnotationElement = { id: 456 };
      const annotation: IAnnotation = { id: 5232 };
      textAnnotationElement.annotation = annotation;

      activatedRoute.data = of({ textAnnotationElement });
      comp.ngOnInit();

      expect(comp.annotationsSharedCollection).toContain(annotation);
      expect(comp.textAnnotationElement).toEqual(textAnnotationElement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITextAnnotationElement>>();
      const textAnnotationElement = { id: 123 };
      jest.spyOn(textAnnotationElementFormService, 'getTextAnnotationElement').mockReturnValue(textAnnotationElement);
      jest.spyOn(textAnnotationElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textAnnotationElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: textAnnotationElement }));
      saveSubject.complete();

      // THEN
      expect(textAnnotationElementFormService.getTextAnnotationElement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(textAnnotationElementService.update).toHaveBeenCalledWith(expect.objectContaining(textAnnotationElement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITextAnnotationElement>>();
      const textAnnotationElement = { id: 123 };
      jest.spyOn(textAnnotationElementFormService, 'getTextAnnotationElement').mockReturnValue({ id: null });
      jest.spyOn(textAnnotationElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textAnnotationElement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: textAnnotationElement }));
      saveSubject.complete();

      // THEN
      expect(textAnnotationElementFormService.getTextAnnotationElement).toHaveBeenCalled();
      expect(textAnnotationElementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITextAnnotationElement>>();
      const textAnnotationElement = { id: 123 };
      jest.spyOn(textAnnotationElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textAnnotationElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(textAnnotationElementService.update).toHaveBeenCalled();
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
