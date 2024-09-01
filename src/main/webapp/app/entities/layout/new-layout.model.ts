import { ILayout } from './layout.model';
export type NewLayout = Omit<ILayout, 'id'> & { id: null };
