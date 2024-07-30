import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnnotation } from '../annotation.model';
import { AnnotationService } from '../service/annotation.service';

const annotationResolve = (route: ActivatedRouteSnapshot): Observable<null | IAnnotation> => {
  const id = route.params['id'];
  if (id) {
    return inject(AnnotationService)
      .find(id)
      .pipe(
        mergeMap((annotation: HttpResponse<IAnnotation>) => {
          if (annotation.body) {
            return of(annotation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default annotationResolve;
