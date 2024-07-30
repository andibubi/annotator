import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnnotationElement } from '../annotation-element.model';
import { AnnotationElementService } from '../service/annotation-element.service';

const annotationElementResolve = (route: ActivatedRouteSnapshot): Observable<null | IAnnotationElement> => {
  const id = route.params['id'];
  if (id) {
    return inject(AnnotationElementService)
      .find(id)
      .pipe(
        mergeMap((annotationElement: HttpResponse<IAnnotationElement>) => {
          if (annotationElement.body) {
            return of(annotationElement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default annotationElementResolve;
