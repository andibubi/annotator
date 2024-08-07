import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class GridService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grid-elements');

  getGridElements(): Observable<any[]> {
    return this.http.get<any[]>(this.resourceUrl);
    //return this.http.get<IAnnotationWithElements>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
