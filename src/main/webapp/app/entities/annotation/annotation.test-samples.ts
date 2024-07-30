import { IAnnotation, NewAnnotation } from './annotation.model';

export const sampleWithRequiredData: IAnnotation = {
  id: 28160,
  videoId: 'gray',
};

export const sampleWithPartialData: IAnnotation = {
  id: 19082,
  videoId: 'against sweetly nor',
};

export const sampleWithFullData: IAnnotation = {
  id: 27881,
  videoId: 'finally interestingly',
};

export const sampleWithNewData: NewAnnotation = {
  videoId: 'inwardly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
