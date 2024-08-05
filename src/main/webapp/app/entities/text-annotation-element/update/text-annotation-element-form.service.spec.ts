import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../text-annotation-element.test-samples';

import { TextAnnotationElementFormService } from './text-annotation-element-form.service';

describe('TextAnnotationElement Form Service', () => {
  let service: TextAnnotationElementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextAnnotationElementFormService);
  });

  describe('Service methods', () => {
    describe('createTextAnnotationElementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTextAnnotationElementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startSec: expect.any(Object),
            text: expect.any(Object),
            annotation: expect.any(Object),
          }),
        );
      });

      it('passing ITextAnnotationElement should create a new form with FormGroup', () => {
        const formGroup = service.createTextAnnotationElementFormGroup(sampleWithRequiredData);

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

    describe('getTextAnnotationElement', () => {
      it('should return NewTextAnnotationElement for default TextAnnotationElement initial value', () => {
        const formGroup = service.createTextAnnotationElementFormGroup(sampleWithNewData);

        const textAnnotationElement = service.getTextAnnotationElement(formGroup) as any;

        expect(textAnnotationElement).toMatchObject(sampleWithNewData);
      });

      it('should return NewTextAnnotationElement for empty TextAnnotationElement initial value', () => {
        const formGroup = service.createTextAnnotationElementFormGroup();

        const textAnnotationElement = service.getTextAnnotationElement(formGroup) as any;

        expect(textAnnotationElement).toMatchObject({});
      });

      it('should return ITextAnnotationElement', () => {
        const formGroup = service.createTextAnnotationElementFormGroup(sampleWithRequiredData);

        const textAnnotationElement = service.getTextAnnotationElement(formGroup) as any;

        expect(textAnnotationElement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITextAnnotationElement should not enable id FormControl', () => {
        const formGroup = service.createTextAnnotationElementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTextAnnotationElement should disable id FormControl', () => {
        const formGroup = service.createTextAnnotationElementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
