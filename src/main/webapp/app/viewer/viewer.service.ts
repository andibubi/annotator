import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotationWithElements } from './annotation-with-elements.model';

export type EntityResponseType = HttpResponse<IAnnotationWithElements>;

@Injectable({ providedIn: 'root' })
export class ViewerService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/view');

  findAnnotationWithElements(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnnotationWithElements>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
