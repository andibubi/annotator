import { IAnnotation } from 'app/entities/annotation/annotation.model';

export interface IAnnotationElement {
  id: number;
  startSec?: number | null;
  text?: string | null;
  annotation?: IAnnotation | null;
}

export type NewAnnotationElement = Omit<IAnnotationElement, 'id'> & { id: null };
