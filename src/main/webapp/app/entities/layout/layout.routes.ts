import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { LayoutComponent } from './list/layout.component';
import { LayoutDetailComponent } from './detail/layout-detail.component';
import LayoutResolve from './route/layout-routing-resolve.service';

const layoutRoute: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LayoutDetailComponent,
    resolve: {
      layout: LayoutResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default layoutRoute;
