import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGridElement, NewGridElement } from '../grid-element.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGridElement for edit and NewGridElementFormGroupInput for create.
 */
type GridElementFormGroupInput = IGridElement | PartialWithRequiredKeyOf<NewGridElement>;

type GridElementFormDefaults = Pick<NewGridElement, 'id'>;

type GridElementFormGroupContent = {
  id: FormControl<IGridElement['id'] | NewGridElement['id']>;
  x: FormControl<IGridElement['x']>;
  y: FormControl<IGridElement['y']>;
  w: FormControl<IGridElement['w']>;
  h: FormControl<IGridElement['h']>;
  content: FormControl<IGridElement['content']>;
  displayAfterMillis: FormControl<IGridElement['displayAfterMillis']>;
  displayDurationMillis: FormControl<IGridElement['displayDurationMillis']>;
  layout: FormControl<IGridElement['layout']>;
  gridElement: FormControl<IGridElement['gridElement']>;
};

export type GridElementFormGroup = FormGroup<GridElementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GridElementFormService {
  createGridElementFormGroup(gridElement: GridElementFormGroupInput = { id: null }): GridElementFormGroup {
    const gridElementRawValue = {
      ...this.getFormDefaults(),
      ...gridElement,
    };
    return new FormGroup<GridElementFormGroupContent>({
      id: new FormControl(
        { value: gridElementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      x: new FormControl(gridElementRawValue.x),
      y: new FormControl(gridElementRawValue.y),
      w: new FormControl(gridElementRawValue.w),
      h: new FormControl(gridElementRawValue.h),
      content: new FormControl(gridElementRawValue.content),
      displayAfterMillis: new FormControl(gridElementRawValue.displayAfterMillis),
      displayDurationMillis: new FormControl(gridElementRawValue.displayDurationMillis),
      layout: new FormControl(gridElementRawValue.layout),
      gridElement: new FormControl(gridElementRawValue.gridElement),
    });
  }

  getGridElement(form: GridElementFormGroup): IGridElement | NewGridElement {
    return form.getRawValue() as IGridElement | NewGridElement;
  }

  resetForm(form: GridElementFormGroup, gridElement: GridElementFormGroupInput): void {
    const gridElementRawValue = { ...this.getFormDefaults(), ...gridElement };
    form.reset(
      {
        ...gridElementRawValue,
        id: { value: gridElementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GridElementFormDefaults {
    return {
      id: null,
    };
  }
}
