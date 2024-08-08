import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGridElement } from '../grid-element.model';
import { GridElementService } from '../service/grid-element.service';

const gridElementResolve = (route: ActivatedRouteSnapshot): Observable<null | IGridElement> => {
  const id = route.params['id'];
  if (id) {
    return inject(GridElementService)
      .find(id)
      .pipe(
        mergeMap((gridElement: HttpResponse<IGridElement>) => {
          if (gridElement.body) {
            return of(gridElement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default gridElementResolve;
