import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AnnotationComponent } from './list/annotation.component';
import { AnnotationDetailComponent } from './detail/annotation-detail.component';
import { AnnotationUpdateComponent } from './update/annotation-update.component';
import AnnotationResolve from './route/annotation-routing-resolve.service';

const annotationRoute: Routes = [
  {
    path: '',
    component: AnnotationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnnotationDetailComponent,
    resolve: {
      annotation: AnnotationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnnotationUpdateComponent,
    resolve: {
      annotation: AnnotationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnnotationUpdateComponent,
    resolve: {
      annotation: AnnotationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default annotationRoute;
