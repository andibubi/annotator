import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AnnotationElementComponent } from './list/annotation-element.component';
import { AnnotationElementDetailComponent } from './detail/annotation-element-detail.component';
import { AnnotationElementUpdateComponent } from './update/annotation-element-update.component';
import AnnotationElementResolve from './route/annotation-element-routing-resolve.service';

const annotationElementRoute: Routes = [
  {
    path: '',
    component: AnnotationElementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnnotationElementDetailComponent,
    resolve: {
      annotationElement: AnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnnotationElementUpdateComponent,
    resolve: {
      annotationElement: AnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnnotationElementUpdateComponent,
    resolve: {
      annotationElement: AnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default annotationElementRoute;
