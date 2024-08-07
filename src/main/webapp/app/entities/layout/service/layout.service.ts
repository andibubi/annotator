import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILayout } from '../layout.model';

type RestOf<T extends ILayout> = Omit<T, 'created_at' | 'updated_at'> & {
  created_at?: string | null;
  updated_at?: string | null;
};

export type RestLayout = RestOf<ILayout>;

export type EntityResponseType = HttpResponse<ILayout>;
export type EntityArrayResponseType = HttpResponse<ILayout[]>;

@Injectable({ providedIn: 'root' })
export class LayoutService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/layouts');

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLayout>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLayout[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  getLayoutIdentifier(layout: Pick<ILayout, 'id'>): number {
    return layout.id;
  }

  compareLayout(o1: Pick<ILayout, 'id'> | null, o2: Pick<ILayout, 'id'> | null): boolean {
    return o1 && o2 ? this.getLayoutIdentifier(o1) === this.getLayoutIdentifier(o2) : o1 === o2;
  }

  addLayoutToCollectionIfMissing<Type extends Pick<ILayout, 'id'>>(
    layoutCollection: Type[],
    ...layoutsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const layouts: Type[] = layoutsToCheck.filter(isPresent);
    if (layouts.length > 0) {
      const layoutCollectionIdentifiers = layoutCollection.map(layoutItem => this.getLayoutIdentifier(layoutItem));
      const layoutsToAdd = layouts.filter(layoutItem => {
        const layoutIdentifier = this.getLayoutIdentifier(layoutItem);
        if (layoutCollectionIdentifiers.includes(layoutIdentifier)) {
          return false;
        }
        layoutCollectionIdentifiers.push(layoutIdentifier);
        return true;
      });
      return [...layoutsToAdd, ...layoutCollection];
    }
    return layoutCollection;
  }

  protected convertDateFromClient<T extends ILayout>(layout: T): RestOf<T> {
    return {
      ...layout,
      created_at: layout.created_at?.toJSON() ?? null,
      updated_at: layout.updated_at?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLayout: RestLayout): ILayout {
    return {
      ...restLayout,
      created_at: restLayout.created_at ? dayjs(restLayout.created_at) : undefined,
      updated_at: restLayout.updated_at ? dayjs(restLayout.updated_at) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLayout>): HttpResponse<ILayout> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLayout[]>): HttpResponse<ILayout[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
