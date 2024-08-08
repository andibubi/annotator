import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGridElement, NewGridElement } from '../grid-element.model';

export type PartialUpdateGridElement = Partial<IGridElement> & Pick<IGridElement, 'id'>;

export type EntityResponseType = HttpResponse<IGridElement>;
export type EntityArrayResponseType = HttpResponse<IGridElement[]>;

@Injectable({ providedIn: 'root' })
export class GridElementService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grid-elements');

  create(gridElement: NewGridElement): Observable<EntityResponseType> {
    return this.http.post<IGridElement>(this.resourceUrl, gridElement, { observe: 'response' });
  }

  update(gridElement: IGridElement): Observable<EntityResponseType> {
    return this.http.put<IGridElement>(`${this.resourceUrl}/${this.getGridElementIdentifier(gridElement)}`, gridElement, {
      observe: 'response',
    });
  }

  partialUpdate(gridElement: PartialUpdateGridElement): Observable<EntityResponseType> {
    return this.http.patch<IGridElement>(`${this.resourceUrl}/${this.getGridElementIdentifier(gridElement)}`, gridElement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGridElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGridElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGridElementIdentifier(gridElement: Pick<IGridElement, 'id'>): number {
    return gridElement.id;
  }

  compareGridElement(o1: Pick<IGridElement, 'id'> | null, o2: Pick<IGridElement, 'id'> | null): boolean {
    return o1 && o2 ? this.getGridElementIdentifier(o1) === this.getGridElementIdentifier(o2) : o1 === o2;
  }

  addGridElementToCollectionIfMissing<Type extends Pick<IGridElement, 'id'>>(
    gridElementCollection: Type[],
    ...gridElementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gridElements: Type[] = gridElementsToCheck.filter(isPresent);
    if (gridElements.length > 0) {
      const gridElementCollectionIdentifiers = gridElementCollection.map(gridElementItem => this.getGridElementIdentifier(gridElementItem));
      const gridElementsToAdd = gridElements.filter(gridElementItem => {
        const gridElementIdentifier = this.getGridElementIdentifier(gridElementItem);
        if (gridElementCollectionIdentifiers.includes(gridElementIdentifier)) {
          return false;
        }
        gridElementCollectionIdentifiers.push(gridElementIdentifier);
        return true;
      });
      return [...gridElementsToAdd, ...gridElementCollection];
    }
    return gridElementCollection;
  }
}
