import { IGridElement, NewGridElement } from './grid-element.model';

export const sampleWithRequiredData: IGridElement = {
  id: 7582,
};

export const sampleWithPartialData: IGridElement = {
  id: 4582,
  x: 16782,
  y: 20980,
  w: 5000,
};

export const sampleWithFullData: IGridElement = {
  id: 15934,
  x: 12481,
  y: 15035,
  w: 17186,
  h: 30649,
  content: 'honeymoon',
  displayAfterMillis: 20973,
  displayDurationMillis: 22971,
};

export const sampleWithNewData: NewGridElement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
