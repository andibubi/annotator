import dayjs from 'dayjs/esm';

import { ILayout } from './layout.model';

export const sampleWithRequiredData: ILayout = {
  id: 21158,
};

export const sampleWithPartialData: ILayout = {
  id: 3758,
  name: 'mechanically',
  updated_at: dayjs('2024-08-06T19:46'),
};

export const sampleWithFullData: ILayout = {
  id: 18255,
  name: 'tuber cruel save',
  created_at: dayjs('2024-08-06T12:54'),
  updated_at: dayjs('2024-08-06T20:31'),
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
