import { IGridElement, NewGridElement } from './grid-element.model';

export const sampleWithRequiredData: IGridElement = {
  id: 13888,
};

export const sampleWithPartialData: IGridElement = {
  id: 10601,
  w: 31608,
  h: 7896,
  displayAfterMillis: 18217,
  displayDurationMillis: 5878,
};

export const sampleWithFullData: IGridElement = {
  id: 28028,
  x: 11883,
  y: 32598,
  w: 21006,
  h: 4412,
  channel: 'vascular hem blah',
  renderer: 'except absolute',
  content: 'second boo icky',
  displayAfterMillis: 5403,
  displayDurationMillis: 4754,
};

export const sampleWithNewData: NewGridElement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
