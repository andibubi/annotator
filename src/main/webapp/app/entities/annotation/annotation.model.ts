import { IUser } from 'app/entities/user/user.model';

export interface IAnnotation {
  id: number;
  videoId?: string | null;
  ancestor?: IAnnotation | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewAnnotation = Omit<IAnnotation, 'id'> & { id: null };
