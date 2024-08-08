import { IAnnotation } from '../entities/annotation/annotation.model';
import { ITextAnnotationElement } from '../entities/text-annotation-element/text-annotation-element.model';
import { IVideoAnnotationElement } from '../entities/video-annotation-element/video-annotation-element.model';

export interface IAnnotationWithElements {
  annotation: IAnnotation;
  textAnnotationElements: Array<ITextAnnotationElement>;
  videoAnnotationElements: Array<IVideoAnnotationElement>;
}
