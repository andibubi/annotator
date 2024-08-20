import { NgZone, inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnotationWithElements } from './annotation-with-elements.model';

export type EntityResponseType = HttpResponse<IAnnotationWithElements>;

@Injectable({ providedIn: 'root' })
export class YtPlayerService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/view');

  nameSuffix2player: Map<string, any> = new Map();

  constructor(private ngZone: NgZone) {}

  findAnnotationWithElements(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnnotationWithElements>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  //////////////////////////////////////
  firstScriptTag: any;
  public createPlayer(nameSuffix: string, videoId: string) {
    if (!document.getElementById('script') && !(window as any).YT) this.appendScriptToDom(nameSuffix);

    return ((window as any).onYouTubeIframeAPIReady = (() => {
      const previousOnYouTubeIframeAPIReady = (window as any).onYouTubeIframeAPIReady;
      return () => {
        if (typeof previousOnYouTubeIframeAPIReady === 'function') {
          previousOnYouTubeIframeAPIReady();
        }
        return this.doCreatePlayer(nameSuffix, videoId);
      };
    })());
  }
  private appendScriptToDom(name: string) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.id = 'script_' + name;
    this.firstScriptTag = document.getElementsByTagName('script')[0];
    this.firstScriptTag!.parentNode!.insertBefore(tag, this.firstScriptTag);
  }
  private doCreatePlayer(nameSuffix: string, videoId: string) {
    let youtubePlayer = new (window as any).YT.Player('youtube-player_' + nameSuffix, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      events: {},
    });
    this.nameSuffix2player.set(nameSuffix, youtubePlayer);
  }
}
