import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../annotation.test-samples';

import { AnnotationFormService } from './annotation-form.service';

describe('Annotation Form Service', () => {
  let service: AnnotationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnotationFormService);
  });

  describe('Service methods', () => {
    describe('createAnnotationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAnnotationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            videoId: expect.any(Object),
            ancestor: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IAnnotation should create a new form with FormGroup', () => {
        const formGroup = service.createAnnotationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            videoId: expect.any(Object),
            ancestor: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getAnnotation', () => {
      it('should return NewAnnotation for default Annotation initial value', () => {
        const formGroup = service.createAnnotationFormGroup(sampleWithNewData);

        const annotation = service.getAnnotation(formGroup) as any;

        expect(annotation).toMatchObject(sampleWithNewData);
      });

      it('should return NewAnnotation for empty Annotation initial value', () => {
        const formGroup = service.createAnnotationFormGroup();

        const annotation = service.getAnnotation(formGroup) as any;

        expect(annotation).toMatchObject({});
      });

      it('should return IAnnotation', () => {
        const formGroup = service.createAnnotationFormGroup(sampleWithRequiredData);

        const annotation = service.getAnnotation(formGroup) as any;

        expect(annotation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAnnotation should not enable id FormControl', () => {
        const formGroup = service.createAnnotationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAnnotation should disable id FormControl', () => {
        const formGroup = service.createAnnotationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
