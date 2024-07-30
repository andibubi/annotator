import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotationElement, NewAnnotationElement } from '../annotation-element.model';

export type PartialUpdateAnnotationElement = Partial<IAnnotationElement> & Pick<IAnnotationElement, 'id'>;

export type EntityResponseType = HttpResponse<IAnnotationElement>;
export type EntityArrayResponseType = HttpResponse<IAnnotationElement[]>;

@Injectable({ providedIn: 'root' })
export class AnnotationElementService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/annotation-elements');

  create(annotationElement: NewAnnotationElement): Observable<EntityResponseType> {
    return this.http.post<IAnnotationElement>(this.resourceUrl, annotationElement, { observe: 'response' });
  }

  update(annotationElement: IAnnotationElement): Observable<EntityResponseType> {
    return this.http.put<IAnnotationElement>(
      `${this.resourceUrl}/${this.getAnnotationElementIdentifier(annotationElement)}`,
      annotationElement,
      { observe: 'response' },
    );
  }

  partialUpdate(annotationElement: PartialUpdateAnnotationElement): Observable<EntityResponseType> {
    return this.http.patch<IAnnotationElement>(
      `${this.resourceUrl}/${this.getAnnotationElementIdentifier(annotationElement)}`,
      annotationElement,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnnotationElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnnotationElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnnotationElementIdentifier(annotationElement: Pick<IAnnotationElement, 'id'>): number {
    return annotationElement.id;
  }

  compareAnnotationElement(o1: Pick<IAnnotationElement, 'id'> | null, o2: Pick<IAnnotationElement, 'id'> | null): boolean {
    return o1 && o2 ? this.getAnnotationElementIdentifier(o1) === this.getAnnotationElementIdentifier(o2) : o1 === o2;
  }

  addAnnotationElementToCollectionIfMissing<Type extends Pick<IAnnotationElement, 'id'>>(
    annotationElementCollection: Type[],
    ...annotationElementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const annotationElements: Type[] = annotationElementsToCheck.filter(isPresent);
    if (annotationElements.length > 0) {
      const annotationElementCollectionIdentifiers = annotationElementCollection.map(annotationElementItem =>
        this.getAnnotationElementIdentifier(annotationElementItem),
      );
      const annotationElementsToAdd = annotationElements.filter(annotationElementItem => {
        const annotationElementIdentifier = this.getAnnotationElementIdentifier(annotationElementItem);
        if (annotationElementCollectionIdentifiers.includes(annotationElementIdentifier)) {
          return false;
        }
        annotationElementCollectionIdentifiers.push(annotationElementIdentifier);
        return true;
      });
      return [...annotationElementsToAdd, ...annotationElementCollection];
    }
    return annotationElementCollection;
  }
}
