import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITextAnnotationElement, NewTextAnnotationElement } from '../text-annotation-element.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITextAnnotationElement for edit and NewTextAnnotationElementFormGroupInput for create.
 */
type TextAnnotationElementFormGroupInput = ITextAnnotationElement | PartialWithRequiredKeyOf<NewTextAnnotationElement>;

type TextAnnotationElementFormDefaults = Pick<NewTextAnnotationElement, 'id'>;

type TextAnnotationElementFormGroupContent = {
  id: FormControl<ITextAnnotationElement['id'] | NewTextAnnotationElement['id']>;
  startSec: FormControl<ITextAnnotationElement['startSec']>;
  text: FormControl<ITextAnnotationElement['text']>;
  annotation: FormControl<ITextAnnotationElement['annotation']>;
};

export type TextAnnotationElementFormGroup = FormGroup<TextAnnotationElementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TextAnnotationElementFormService {
  createTextAnnotationElementFormGroup(
    textAnnotationElement: TextAnnotationElementFormGroupInput = { id: null },
  ): TextAnnotationElementFormGroup {
    const textAnnotationElementRawValue = {
      ...this.getFormDefaults(),
      ...textAnnotationElement,
    };
    return new FormGroup<TextAnnotationElementFormGroupContent>({
      id: new FormControl(
        { value: textAnnotationElementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startSec: new FormControl(textAnnotationElementRawValue.startSec, {
        validators: [Validators.required],
      }),
      text: new FormControl(textAnnotationElementRawValue.text, {
        validators: [Validators.required],
      }),
      annotation: new FormControl(textAnnotationElementRawValue.annotation),
    });
  }

  getTextAnnotationElement(form: TextAnnotationElementFormGroup): ITextAnnotationElement | NewTextAnnotationElement {
    return form.getRawValue() as ITextAnnotationElement | NewTextAnnotationElement;
  }

  resetForm(form: TextAnnotationElementFormGroup, textAnnotationElement: TextAnnotationElementFormGroupInput): void {
    const textAnnotationElementRawValue = { ...this.getFormDefaults(), ...textAnnotationElement };
    form.reset(
      {
        ...textAnnotationElementRawValue,
        id: { value: textAnnotationElementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TextAnnotationElementFormDefaults {
    return {
      id: null,
    };
  }
}
