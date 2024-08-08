import dayjs from 'dayjs/esm';

import { ILayout } from './layout.model';

export const sampleWithRequiredData: ILayout = {
  id: 18156,
};

export const sampleWithPartialData: ILayout = {
  id: 13608,
  name: 'about attentive start',
  created_at: dayjs('2024-08-06T20:32'),
};

export const sampleWithFullData: ILayout = {
  id: 19119,
  name: 'netbook siphon beneficial',
  created_at: dayjs('2024-08-06T21:47'),
  updated_at: dayjs('2024-08-06T17:41'),
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
