import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../grid-element.test-samples';

import { GridElementFormService } from './grid-element-form.service';

describe('GridElement Form Service', () => {
  let service: GridElementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridElementFormService);
  });

  describe('Service methods', () => {
    describe('createGridElementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGridElementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            x: expect.any(Object),
            y: expect.any(Object),
            w: expect.any(Object),
            h: expect.any(Object),
            channel: expect.any(Object),
            renderer: expect.any(Object),
            content: expect.any(Object),
            isCreateable: expect.any(Object),
            layout: expect.any(Object),
            gridElement: expect.any(Object),
          }),
        );
      });

      it('passing IGridElement should create a new form with FormGroup', () => {
        const formGroup = service.createGridElementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            x: expect.any(Object),
            y: expect.any(Object),
            w: expect.any(Object),
            h: expect.any(Object),
            channel: expect.any(Object),
            renderer: expect.any(Object),
            content: expect.any(Object),
            isCreateable: expect.any(Object),
            layout: expect.any(Object),
            gridElement: expect.any(Object),
          }),
        );
      });
    });

    describe('getGridElement', () => {
      it('should return NewGridElement for default GridElement initial value', () => {
        const formGroup = service.createGridElementFormGroup(sampleWithNewData);

        const gridElement = service.getGridElement(formGroup) as any;

        expect(gridElement).toMatchObject(sampleWithNewData);
      });

      it('should return NewGridElement for empty GridElement initial value', () => {
        const formGroup = service.createGridElementFormGroup();

        const gridElement = service.getGridElement(formGroup) as any;

        expect(gridElement).toMatchObject({});
      });

      it('should return IGridElement', () => {
        const formGroup = service.createGridElementFormGroup(sampleWithRequiredData);

        const gridElement = service.getGridElement(formGroup) as any;

        expect(gridElement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGridElement should not enable id FormControl', () => {
        const formGroup = service.createGridElementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGridElement should disable id FormControl', () => {
        const formGroup = service.createGridElementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
