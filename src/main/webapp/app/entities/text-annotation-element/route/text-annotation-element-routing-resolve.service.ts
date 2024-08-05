import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITextAnnotationElement } from '../text-annotation-element.model';
import { TextAnnotationElementService } from '../service/text-annotation-element.service';

const textAnnotationElementResolve = (route: ActivatedRouteSnapshot): Observable<null | ITextAnnotationElement> => {
  const id = route.params['id'];
  if (id) {
    return inject(TextAnnotationElementService)
      .find(id)
      .pipe(
        mergeMap((textAnnotationElement: HttpResponse<ITextAnnotationElement>) => {
          if (textAnnotationElement.body) {
            return of(textAnnotationElement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default textAnnotationElementResolve;
