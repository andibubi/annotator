import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface ILayout {
  id: number;
  name?: string | null;
  created_at?: dayjs.Dayjs | null;
  updated_at?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}
