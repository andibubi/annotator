import { ILayout } from 'app/entities/layout/layout.model';

export interface IGridElement {
  id: number;
  x?: number | null;
  y?: number | null;
  w?: number | null;
  h?: number | null;
  content?: string | null;
  displayAfterMillis?: number | null;
  displayDurationMillis?: number | null;
  layout?: Pick<ILayout, 'id'> | null;
  gridElement?: Pick<IGridElement, 'id'> | null;
}

export type NewGridElement = Omit<IGridElement, 'id'> & { id: null };