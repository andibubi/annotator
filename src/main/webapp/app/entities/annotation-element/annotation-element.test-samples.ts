import { IAnnotationElement, NewAnnotationElement } from './annotation-element.model';

export const sampleWithRequiredData: IAnnotationElement = {
  id: 28404,
  startSec: 6903,
  text: 'greedily hence atop',
};

export const sampleWithPartialData: IAnnotationElement = {
  id: 3417,
  startSec: 19594,
  text: 'sky',
};

export const sampleWithFullData: IAnnotationElement = {
  id: 1294,
  startSec: 22029,
  text: 'cruelly',
};

export const sampleWithNewData: NewAnnotationElement = {
  startSec: 3926,
  text: 'divalent',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
