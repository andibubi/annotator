import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../video-annotation-element.test-samples';

import { VideoAnnotationElementFormService } from './video-annotation-element-form.service';

describe('VideoAnnotationElement Form Service', () => {
  let service: VideoAnnotationElementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoAnnotationElementFormService);
  });

  describe('Service methods', () => {
    describe('createVideoAnnotationElementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startSec: expect.any(Object),
            stopSec: expect.any(Object),
            videoId: expect.any(Object),
            videoStartSec: expect.any(Object),
            annotation: expect.any(Object),
          }),
        );
      });

      it('passing IVideoAnnotationElement should create a new form with FormGroup', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startSec: expect.any(Object),
            stopSec: expect.any(Object),
            videoId: expect.any(Object),
            videoStartSec: expect.any(Object),
            annotation: expect.any(Object),
          }),
        );
      });
    });

    describe('getVideoAnnotationElement', () => {
      it('should return NewVideoAnnotationElement for default VideoAnnotationElement initial value', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup(sampleWithNewData);

        const videoAnnotationElement = service.getVideoAnnotationElement(formGroup) as any;

        expect(videoAnnotationElement).toMatchObject(sampleWithNewData);
      });

      it('should return NewVideoAnnotationElement for empty VideoAnnotationElement initial value', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup();

        const videoAnnotationElement = service.getVideoAnnotationElement(formGroup) as any;

        expect(videoAnnotationElement).toMatchObject({});
      });

      it('should return IVideoAnnotationElement', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup(sampleWithRequiredData);

        const videoAnnotationElement = service.getVideoAnnotationElement(formGroup) as any;

        expect(videoAnnotationElement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVideoAnnotationElement should not enable id FormControl', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVideoAnnotationElement should disable id FormControl', () => {
        const formGroup = service.createVideoAnnotationElementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
