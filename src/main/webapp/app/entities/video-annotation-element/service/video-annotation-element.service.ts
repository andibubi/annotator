import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVideoAnnotationElement, NewVideoAnnotationElement } from '../video-annotation-element.model';

export type PartialUpdateVideoAnnotationElement = Partial<IVideoAnnotationElement> & Pick<IVideoAnnotationElement, 'id'>;

export type EntityResponseType = HttpResponse<IVideoAnnotationElement>;
export type EntityArrayResponseType = HttpResponse<IVideoAnnotationElement[]>;

@Injectable({ providedIn: 'root' })
export class VideoAnnotationElementService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/video-annotation-elements');

  create(videoAnnotationElement: NewVideoAnnotationElement): Observable<EntityResponseType> {
    return this.http.post<IVideoAnnotationElement>(this.resourceUrl, videoAnnotationElement, { observe: 'response' });
  }

  update(videoAnnotationElement: IVideoAnnotationElement): Observable<EntityResponseType> {
    return this.http.put<IVideoAnnotationElement>(
      `${this.resourceUrl}/${this.getVideoAnnotationElementIdentifier(videoAnnotationElement)}`,
      videoAnnotationElement,
      { observe: 'response' },
    );
  }

  partialUpdate(videoAnnotationElement: PartialUpdateVideoAnnotationElement): Observable<EntityResponseType> {
    return this.http.patch<IVideoAnnotationElement>(
      `${this.resourceUrl}/${this.getVideoAnnotationElementIdentifier(videoAnnotationElement)}`,
      videoAnnotationElement,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVideoAnnotationElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVideoAnnotationElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVideoAnnotationElementIdentifier(videoAnnotationElement: Pick<IVideoAnnotationElement, 'id'>): number {
    return videoAnnotationElement.id;
  }

  compareVideoAnnotationElement(o1: Pick<IVideoAnnotationElement, 'id'> | null, o2: Pick<IVideoAnnotationElement, 'id'> | null): boolean {
    return o1 && o2 ? this.getVideoAnnotationElementIdentifier(o1) === this.getVideoAnnotationElementIdentifier(o2) : o1 === o2;
  }

  addVideoAnnotationElementToCollectionIfMissing<Type extends Pick<IVideoAnnotationElement, 'id'>>(
    videoAnnotationElementCollection: Type[],
    ...videoAnnotationElementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const videoAnnotationElements: Type[] = videoAnnotationElementsToCheck.filter(isPresent);
    if (videoAnnotationElements.length > 0) {
      const videoAnnotationElementCollectionIdentifiers = videoAnnotationElementCollection.map(videoAnnotationElementItem =>
        this.getVideoAnnotationElementIdentifier(videoAnnotationElementItem),
      );
      const videoAnnotationElementsToAdd = videoAnnotationElements.filter(videoAnnotationElementItem => {
        const videoAnnotationElementIdentifier = this.getVideoAnnotationElementIdentifier(videoAnnotationElementItem);
        if (videoAnnotationElementCollectionIdentifiers.includes(videoAnnotationElementIdentifier)) {
          return false;
        }
        videoAnnotationElementCollectionIdentifiers.push(videoAnnotationElementIdentifier);
        return true;
      });
      return [...videoAnnotationElementsToAdd, ...videoAnnotationElementCollection];
    }
    return videoAnnotationElementCollection;
  }
}
