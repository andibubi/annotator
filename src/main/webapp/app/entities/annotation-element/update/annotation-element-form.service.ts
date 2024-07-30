import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAnnotationElement, NewAnnotationElement } from '../annotation-element.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnnotationElement for edit and NewAnnotationElementFormGroupInput for create.
 */
type AnnotationElementFormGroupInput = IAnnotationElement | PartialWithRequiredKeyOf<NewAnnotationElement>;

type AnnotationElementFormDefaults = Pick<NewAnnotationElement, 'id'>;

type AnnotationElementFormGroupContent = {
  id: FormControl<IAnnotationElement['id'] | NewAnnotationElement['id']>;
  startSec: FormControl<IAnnotationElement['startSec']>;
  text: FormControl<IAnnotationElement['text']>;
  annotation: FormControl<IAnnotationElement['annotation']>;
};

export type AnnotationElementFormGroup = FormGroup<AnnotationElementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnnotationElementFormService {
  createAnnotationElementFormGroup(annotationElement: AnnotationElementFormGroupInput = { id: null }): AnnotationElementFormGroup {
    const annotationElementRawValue = {
      ...this.getFormDefaults(),
      ...annotationElement,
    };
    return new FormGroup<AnnotationElementFormGroupContent>({
      id: new FormControl(
        { value: annotationElementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startSec: new FormControl(annotationElementRawValue.startSec, {
        validators: [Validators.required],
      }),
      text: new FormControl(annotationElementRawValue.text, {
        validators: [Validators.required],
      }),
      annotation: new FormControl(annotationElementRawValue.annotation),
    });
  }

  getAnnotationElement(form: AnnotationElementFormGroup): IAnnotationElement | NewAnnotationElement {
    return form.getRawValue() as IAnnotationElement | NewAnnotationElement;
  }

  resetForm(form: AnnotationElementFormGroup, annotationElement: AnnotationElementFormGroupInput): void {
    const annotationElementRawValue = { ...this.getFormDefaults(), ...annotationElement };
    form.reset(
      {
        ...annotationElementRawValue,
        id: { value: annotationElementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AnnotationElementFormDefaults {
    return {
      id: null,
    };
  }
}
