import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TextAnnotationElementComponent } from './list/text-annotation-element.component';
import { TextAnnotationElementDetailComponent } from './detail/text-annotation-element-detail.component';
import { TextAnnotationElementUpdateComponent } from './update/text-annotation-element-update.component';
import TextAnnotationElementResolve from './route/text-annotation-element-routing-resolve.service';

const textAnnotationElementRoute: Routes = [
  {
    path: '',
    component: TextAnnotationElementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TextAnnotationElementDetailComponent,
    resolve: {
      textAnnotationElement: TextAnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TextAnnotationElementUpdateComponent,
    resolve: {
      textAnnotationElement: TextAnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TextAnnotationElementUpdateComponent,
    resolve: {
      textAnnotationElement: TextAnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default textAnnotationElementRoute;
