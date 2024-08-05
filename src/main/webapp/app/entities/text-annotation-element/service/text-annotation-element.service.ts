import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITextAnnotationElement, NewTextAnnotationElement } from '../text-annotation-element.model';

export type PartialUpdateTextAnnotationElement = Partial<ITextAnnotationElement> & Pick<ITextAnnotationElement, 'id'>;

export type EntityResponseType = HttpResponse<ITextAnnotationElement>;
export type EntityArrayResponseType = HttpResponse<ITextAnnotationElement[]>;

@Injectable({ providedIn: 'root' })
export class TextAnnotationElementService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/text-annotation-elements');

  create(textAnnotationElement: NewTextAnnotationElement): Observable<EntityResponseType> {
    return this.http.post<ITextAnnotationElement>(this.resourceUrl, textAnnotationElement, { observe: 'response' });
  }

  update(textAnnotationElement: ITextAnnotationElement): Observable<EntityResponseType> {
    return this.http.put<ITextAnnotationElement>(
      `${this.resourceUrl}/${this.getTextAnnotationElementIdentifier(textAnnotationElement)}`,
      textAnnotationElement,
      { observe: 'response' },
    );
  }

  partialUpdate(textAnnotationElement: PartialUpdateTextAnnotationElement): Observable<EntityResponseType> {
    return this.http.patch<ITextAnnotationElement>(
      `${this.resourceUrl}/${this.getTextAnnotationElementIdentifier(textAnnotationElement)}`,
      textAnnotationElement,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITextAnnotationElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITextAnnotationElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTextAnnotationElementIdentifier(textAnnotationElement: Pick<ITextAnnotationElement, 'id'>): number {
    return textAnnotationElement.id;
  }

  compareTextAnnotationElement(o1: Pick<ITextAnnotationElement, 'id'> | null, o2: Pick<ITextAnnotationElement, 'id'> | null): boolean {
    return o1 && o2 ? this.getTextAnnotationElementIdentifier(o1) === this.getTextAnnotationElementIdentifier(o2) : o1 === o2;
  }

  addTextAnnotationElementToCollectionIfMissing<Type extends Pick<ITextAnnotationElement, 'id'>>(
    textAnnotationElementCollection: Type[],
    ...textAnnotationElementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const textAnnotationElements: Type[] = textAnnotationElementsToCheck.filter(isPresent);
    if (textAnnotationElements.length > 0) {
      const textAnnotationElementCollectionIdentifiers = textAnnotationElementCollection.map(textAnnotationElementItem =>
        this.getTextAnnotationElementIdentifier(textAnnotationElementItem),
      );
      const textAnnotationElementsToAdd = textAnnotationElements.filter(textAnnotationElementItem => {
        const textAnnotationElementIdentifier = this.getTextAnnotationElementIdentifier(textAnnotationElementItem);
        if (textAnnotationElementCollectionIdentifiers.includes(textAnnotationElementIdentifier)) {
          return false;
        }
        textAnnotationElementCollectionIdentifiers.push(textAnnotationElementIdentifier);
        return true;
      });
      return [...textAnnotationElementsToAdd, ...textAnnotationElementCollection];
    }
    return textAnnotationElementCollection;
  }
}
