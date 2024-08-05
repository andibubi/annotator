import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVideoAnnotationElement, NewVideoAnnotationElement } from '../video-annotation-element.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVideoAnnotationElement for edit and NewVideoAnnotationElementFormGroupInput for create.
 */
type VideoAnnotationElementFormGroupInput = IVideoAnnotationElement | PartialWithRequiredKeyOf<NewVideoAnnotationElement>;

type VideoAnnotationElementFormDefaults = Pick<NewVideoAnnotationElement, 'id'>;

type VideoAnnotationElementFormGroupContent = {
  id: FormControl<IVideoAnnotationElement['id'] | NewVideoAnnotationElement['id']>;
  startSec: FormControl<IVideoAnnotationElement['startSec']>;
  stopSec: FormControl<IVideoAnnotationElement['stopSec']>;
  videoId: FormControl<IVideoAnnotationElement['videoId']>;
  videoStartSec: FormControl<IVideoAnnotationElement['videoStartSec']>;
  annotation: FormControl<IVideoAnnotationElement['annotation']>;
};

export type VideoAnnotationElementFormGroup = FormGroup<VideoAnnotationElementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VideoAnnotationElementFormService {
  createVideoAnnotationElementFormGroup(
    videoAnnotationElement: VideoAnnotationElementFormGroupInput = { id: null },
  ): VideoAnnotationElementFormGroup {
    const videoAnnotationElementRawValue = {
      ...this.getFormDefaults(),
      ...videoAnnotationElement,
    };
    return new FormGroup<VideoAnnotationElementFormGroupContent>({
      id: new FormControl(
        { value: videoAnnotationElementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startSec: new FormControl(videoAnnotationElementRawValue.startSec, {
        validators: [Validators.required],
      }),
      stopSec: new FormControl(videoAnnotationElementRawValue.stopSec, {
        validators: [Validators.required],
      }),
      videoId: new FormControl(videoAnnotationElementRawValue.videoId, {
        validators: [Validators.required],
      }),
      videoStartSec: new FormControl(videoAnnotationElementRawValue.videoStartSec, {
        validators: [Validators.required],
      }),
      annotation: new FormControl(videoAnnotationElementRawValue.annotation),
    });
  }

  getVideoAnnotationElement(form: VideoAnnotationElementFormGroup): IVideoAnnotationElement | NewVideoAnnotationElement {
    return form.getRawValue() as IVideoAnnotationElement | NewVideoAnnotationElement;
  }

  resetForm(form: VideoAnnotationElementFormGroup, videoAnnotationElement: VideoAnnotationElementFormGroupInput): void {
    const videoAnnotationElementRawValue = { ...this.getFormDefaults(), ...videoAnnotationElement };
    form.reset(
      {
        ...videoAnnotationElementRawValue,
        id: { value: videoAnnotationElementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VideoAnnotationElementFormDefaults {
    return {
      id: null,
    };
  }
}
