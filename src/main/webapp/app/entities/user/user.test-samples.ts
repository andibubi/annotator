import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 4485,
  login: '!=Nz@b\\EWi\\qkeDIoY\\8H6\\qc\\WUJRlZc',
};

export const sampleWithPartialData: IUser = {
  id: 17101,
  login: 'JVr2jR',
};

export const sampleWithFullData: IUser = {
  id: 16116,
  login: 'Rz@bfAOQ\\kElzyE\\.tzzZf',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
