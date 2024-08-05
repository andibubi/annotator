import { IAnnotation } from 'app/entities/annotation/annotation.model';

export interface IVideoAnnotationElement {
  id: number;
  startSec?: number | null;
  stopSec?: number | null;
  videoId?: string | null;
  videoStartSec?: number | null;
  annotation?: IAnnotation | null;
}

export type NewVideoAnnotationElement = Omit<IVideoAnnotationElement, 'id'> & { id: null };
