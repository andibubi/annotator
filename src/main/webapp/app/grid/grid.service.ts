import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class GridService {
  private apiUrl = 'http://localhost:8080/api'; // API-URL direkt hier definieren

  constructor(private http: HttpClient) {}

  getGridElements(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grid-elements/${id}`);
  }
  getGridElementsByLayout(layoutId: number): Observable<any[]> {
    //return this.http.get<any[]>(`${this.apiUrl}/layouts/${layoutId}/grid-elements`);
    // Übel: Struktur wird in grid.component.scheduleUpdates festgelegt
    return new Observable<any>();
  }
}
