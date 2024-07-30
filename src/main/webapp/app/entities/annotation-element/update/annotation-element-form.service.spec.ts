import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../annotation-element.test-samples';

import { AnnotationElementFormService } from './annotation-element-form.service';

describe('AnnotationElement Form Service', () => {
  let service: AnnotationElementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnotationElementFormService);
  });

  describe('Service methods', () => {
    describe('createAnnotationElementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAnnotationElementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startSec: expect.any(Object),
            text: expect.any(Object),
            annotation: expect.any(Object),
          }),
        );
      });

      it('passing IAnnotationElement should create a new form with FormGroup', () => {
        const formGroup = service.createAnnotationElementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startSec: expect.any(Object),
            text: expect.any(Object),
            annotation: expect.any(Object),
          }),
        );
      });
    });

    describe('getAnnotationElement', () => {
      it('should return NewAnnotationElement for default AnnotationElement initial value', () => {
        const formGroup = service.createAnnotationElementFormGroup(sampleWithNewData);

        const annotationElement = service.getAnnotationElement(formGroup) as any;

        expect(annotationElement).toMatchObject(sampleWithNewData);
      });

      it('should return NewAnnotationElement for empty AnnotationElement initial value', () => {
        const formGroup = service.createAnnotationElementFormGroup();

        const annotationElement = service.getAnnotationElement(formGroup) as any;

        expect(annotationElement).toMatchObject({});
      });

      it('should return IAnnotationElement', () => {
        const formGroup = service.createAnnotationElementFormGroup(sampleWithRequiredData);

        const annotationElement = service.getAnnotationElement(formGroup) as any;

        expect(annotationElement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAnnotationElement should not enable id FormControl', () => {
        const formGroup = service.createAnnotationElementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAnnotationElement should disable id FormControl', () => {
        const formGroup = service.createAnnotationElementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
