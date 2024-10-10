import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAnnotation, NewAnnotation } from '../annotation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnnotation for edit and NewAnnotationFormGroupInput for create.
 */
type AnnotationFormGroupInput = IAnnotation | PartialWithRequiredKeyOf<NewAnnotation>;

type AnnotationFormDefaults = Pick<NewAnnotation, 'id'>;

type AnnotationFormGroupContent = {
  id: FormControl<IAnnotation['id'] | NewAnnotation['id']>;
  videoId: FormControl<IAnnotation['videoId']>;
  ancestor: FormControl<IAnnotation['ancestor']>;
  user: FormControl<IAnnotation['user']>;
};

export type AnnotationFormGroup = FormGroup<AnnotationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnnotationFormService {
  createAnnotationFormGroup(annotation: AnnotationFormGroupInput = { id: null }): AnnotationFormGroup {
    const annotationRawValue = {
      ...this.getFormDefaults(),
      ...annotation,
    };
    return new FormGroup<AnnotationFormGroupContent>({
      id: new FormControl(
        { value: annotationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      videoId: new FormControl(annotationRawValue.videoId, {
        validators: [Validators.required],
      }),
      ancestor: new FormControl(annotationRawValue.ancestor),
      user: new FormControl(annotationRawValue.user),
    });
  }

  getAnnotation(form: AnnotationFormGroup): IAnnotation | NewAnnotation {
    return form.getRawValue() as IAnnotation | NewAnnotation;
  }

  resetForm(form: AnnotationFormGroup, annotation: AnnotationFormGroupInput): void {
    const annotationRawValue = { ...this.getFormDefaults(), ...annotation };
    form.reset(
      {
        ...annotationRawValue,
        id: { value: annotationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AnnotationFormDefaults {
    return {
      id: null,
    };
  }
}
