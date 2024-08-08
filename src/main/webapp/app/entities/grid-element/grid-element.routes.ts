import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { GridElementComponent } from './list/grid-element.component';
import { GridElementDetailComponent } from './detail/grid-element-detail.component';
import { GridElementUpdateComponent } from './update/grid-element-update.component';
import GridElementResolve from './route/grid-element-routing-resolve.service';

const gridElementRoute: Routes = [
  {
    path: '',
    component: GridElementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GridElementDetailComponent,
    resolve: {
      gridElement: GridElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GridElementUpdateComponent,
    resolve: {
      gridElement: GridElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GridElementUpdateComponent,
    resolve: {
      gridElement: GridElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gridElementRoute;
