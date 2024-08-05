import { IVideoAnnotationElement, NewVideoAnnotationElement } from './video-annotation-element.model';

export const sampleWithRequiredData: IVideoAnnotationElement = {
  id: 28404,
  startSec: 6903,
  stopSec: 6903,
  videoId: 'greedily hence atop',
  videoStartSec: 6903,
};

export const sampleWithPartialData: IVideoAnnotationElement = {
  id: 3417,
  startSec: 19594,
  stopSec: 19594,
  videoId: 'sky',
  videoStartSec: 19594,
};

export const sampleWithFullData: IVideoAnnotationElement = {
  id: 1294,
  startSec: 22029,
  stopSec: 22029,
  videoId: 'cruelly',
  videoStartSec: 22029,
};

export const sampleWithNewData: NewVideoAnnotationElement = {
  startSec: 3926,
  stopSec: 3926,
  videoId: 'divalent',
  videoStartSec: 3926,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
