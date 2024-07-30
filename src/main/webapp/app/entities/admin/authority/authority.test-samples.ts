import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '4df9da79-0165-4aff-9fd4-dfcdf8aaef59',
};

export const sampleWithPartialData: IAuthority = {
  name: '17d61b5d-5da2-492e-a900-9bdbc082f2bf',
};

export const sampleWithFullData: IAuthority = {
  name: '302f1632-d282-4043-98a9-e40770971f0f',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
