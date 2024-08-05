import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAnnotation } from 'app/entities/annotation/annotation.model';
import { AnnotationService } from 'app/entities/annotation/service/annotation.service';
import { VideoAnnotationElementService } from '../service/video-annotation-element.service';
import { IVideoAnnotationElement } from '../video-annotation-element.model';
import { VideoAnnotationElementFormService } from './video-annotation-element-form.service';

import { VideoAnnotationElementUpdateComponent } from './video-annotation-element-update.component';

describe('VideoAnnotationElement Management Update Component', () => {
  let comp: VideoAnnotationElementUpdateComponent;
  let fixture: ComponentFixture<VideoAnnotationElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let videoAnnotationElementFormService: VideoAnnotationElementFormService;
  let videoAnnotationElementService: VideoAnnotationElementService;
  let annotationService: AnnotationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VideoAnnotationElementUpdateComponent],
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
      .overrideTemplate(VideoAnnotationElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VideoAnnotationElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    videoAnnotationElementFormService = TestBed.inject(VideoAnnotationElementFormService);
    videoAnnotationElementService = TestBed.inject(VideoAnnotationElementService);
    annotationService = TestBed.inject(AnnotationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Annotation query and add missing value', () => {
      const videoAnnotationElement: IVideoAnnotationElement = { id: 456 };
      const annotation: IAnnotation = { id: 10693 };
      videoAnnotationElement.annotation = annotation;

      const annotationCollection: IAnnotation[] = [{ id: 28788 }];
      jest.spyOn(annotationService, 'query').mockReturnValue(of(new HttpResponse({ body: annotationCollection })));
      const additionalAnnotations = [annotation];
      const expectedCollection: IAnnotation[] = [...additionalAnnotations, ...annotationCollection];
      jest.spyOn(annotationService, 'addAnnotationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ videoAnnotationElement });
      comp.ngOnInit();

      expect(annotationService.query).toHaveBeenCalled();
      expect(annotationService.addAnnotationToCollectionIfMissing).toHaveBeenCalledWith(
        annotationCollection,
        ...additionalAnnotations.map(expect.objectContaining),
      );
      expect(comp.annotationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const videoAnnotationElement: IVideoAnnotationElement = { id: 456 };
      const annotation: IAnnotation = { id: 5232 };
      videoAnnotationElement.annotation = annotation;

      activatedRoute.data = of({ videoAnnotationElement });
      comp.ngOnInit();

      expect(comp.annotationsSharedCollection).toContain(annotation);
      expect(comp.videoAnnotationElement).toEqual(videoAnnotationElement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVideoAnnotationElement>>();
      const videoAnnotationElement = { id: 123 };
      jest.spyOn(videoAnnotationElementFormService, 'getVideoAnnotationElement').mockReturnValue(videoAnnotationElement);
      jest.spyOn(videoAnnotationElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ videoAnnotationElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: videoAnnotationElement }));
      saveSubject.complete();

      // THEN
      expect(videoAnnotationElementFormService.getVideoAnnotationElement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(videoAnnotationElementService.update).toHaveBeenCalledWith(expect.objectContaining(videoAnnotationElement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVideoAnnotationElement>>();
      const videoAnnotationElement = { id: 123 };
      jest.spyOn(videoAnnotationElementFormService, 'getVideoAnnotationElement').mockReturnValue({ id: null });
      jest.spyOn(videoAnnotationElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ videoAnnotationElement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: videoAnnotationElement }));
      saveSubject.complete();

      // THEN
      expect(videoAnnotationElementFormService.getVideoAnnotationElement).toHaveBeenCalled();
      expect(videoAnnotationElementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVideoAnnotationElement>>();
      const videoAnnotationElement = { id: 123 };
      jest.spyOn(videoAnnotationElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ videoAnnotationElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(videoAnnotationElementService.update).toHaveBeenCalled();
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
