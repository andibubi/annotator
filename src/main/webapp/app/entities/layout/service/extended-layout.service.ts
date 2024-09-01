import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { LayoutService } from './layout.service';
import { ILayout } from '../layout.model';
import { NewLayout } from '../new-layout.model';

@Injectable({
  providedIn: 'root',
})
export class ExtendedLayoutService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/layouts');

  constructor(private layoutService: LayoutService) {}

  // Beispiel für eine erweiterte Methode
  create(videoId: string, layout: NewLayout): Observable<HttpResponse<ILayout>> {
    return this.http.post<ILayout>(`${this.resourceUrl}?videoId=${encodeURIComponent(videoId)}`, layout, { observe: 'response' });
  }
}
