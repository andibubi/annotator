import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVideoAnnotationElement } from '../video-annotation-element.model';
import { VideoAnnotationElementService } from '../service/video-annotation-element.service';

const videoAnnotationElementResolve = (route: ActivatedRouteSnapshot): Observable<null | IVideoAnnotationElement> => {
  const id = route.params['id'];
  if (id) {
    return inject(VideoAnnotationElementService)
      .find(id)
      .pipe(
        mergeMap((videoAnnotationElement: HttpResponse<IVideoAnnotationElement>) => {
          if (videoAnnotationElement.body) {
            return of(videoAnnotationElement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default videoAnnotationElementResolve;
