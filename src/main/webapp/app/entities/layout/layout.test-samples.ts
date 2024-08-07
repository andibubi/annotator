import dayjs from 'dayjs/esm';

import { ILayout } from './layout.model';

export const sampleWithRequiredData: ILayout = {
  id: 2843,
};

export const sampleWithPartialData: ILayout = {
  id: 21471,
  updated_at: dayjs('2024-08-07T00:55'),
};

export const sampleWithFullData: ILayout = {
  id: 31691,
  name: 'shellac aw',
  created_at: dayjs('2024-08-06T16:09'),
  updated_at: dayjs('2024-08-07T01:46'),
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
