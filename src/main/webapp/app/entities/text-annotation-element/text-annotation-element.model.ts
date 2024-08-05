import { IAnnotation } from 'app/entities/annotation/annotation.model';

export interface ITextAnnotationElement {
  id: number;
  startSec?: number | null;
  text?: string | null;
  annotation?: IAnnotation | null;
}

export type NewTextAnnotationElement = Omit<ITextAnnotationElement, 'id'> & { id: null };
