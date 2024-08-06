import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotation, NewAnnotation } from '../annotation.model';

export type PartialUpdateAnnotation = Partial<IAnnotation> & Pick<IAnnotation, 'id'>;

export type EntityResponseType = HttpResponse<IAnnotation>;
export type EntityArrayResponseType = HttpResponse<IAnnotation[]>;

@Injectable({ providedIn: 'root' })
export class AnnotationService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/annotations');

  getQrCode(id: number): Observable<any> {
    return this.http.get(this.applicationConfigService.getEndpointFor(`api/viewUrl/${id}`));
  }

  create(annotation: NewAnnotation): Observable<EntityResponseType> {
    return this.http.post<IAnnotation>(this.resourceUrl, annotation, { observe: 'response' });
  }

  update(annotation: IAnnotation): Observable<EntityResponseType> {
    return this.http.put<IAnnotation>(`${this.resourceUrl}/${this.getAnnotationIdentifier(annotation)}`, annotation, {
      observe: 'response',
    });
  }

  partialUpdate(annotation: PartialUpdateAnnotation): Observable<EntityResponseType> {
    return this.http.patch<IAnnotation>(`${this.resourceUrl}/${this.getAnnotationIdentifier(annotation)}`, annotation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnnotation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnnotation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnnotationIdentifier(annotation: Pick<IAnnotation, 'id'>): number {
    return annotation.id;
  }

  compareAnnotation(o1: Pick<IAnnotation, 'id'> | null, o2: Pick<IAnnotation, 'id'> | null): boolean {
    return o1 && o2 ? this.getAnnotationIdentifier(o1) === this.getAnnotationIdentifier(o2) : o1 === o2;
  }

  addAnnotationToCollectionIfMissing<Type extends Pick<IAnnotation, 'id'>>(
    annotationCollection: Type[],
    ...annotationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const annotations: Type[] = annotationsToCheck.filter(isPresent);
    if (annotations.length > 0) {
      const annotationCollectionIdentifiers = annotationCollection.map(annotationItem => this.getAnnotationIdentifier(annotationItem));
      const annotationsToAdd = annotations.filter(annotationItem => {
        const annotationIdentifier = this.getAnnotationIdentifier(annotationItem);
        if (annotationCollectionIdentifiers.includes(annotationIdentifier)) {
          return false;
        }
        annotationCollectionIdentifiers.push(annotationIdentifier);
        return true;
      });
      return [...annotationsToAdd, ...annotationCollection];
    }
    return annotationCollection;
  }
}
