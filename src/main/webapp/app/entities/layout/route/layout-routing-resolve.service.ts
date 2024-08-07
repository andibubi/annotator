import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILayout } from '../layout.model';
import { LayoutService } from '../service/layout.service';

const layoutResolve = (route: ActivatedRouteSnapshot): Observable<null | ILayout> => {
  const id = route.params['id'];
  if (id) {
    return inject(LayoutService)
      .find(id)
      .pipe(
        mergeMap((layout: HttpResponse<ILayout>) => {
          if (layout.body) {
            return of(layout.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default layoutResolve;
