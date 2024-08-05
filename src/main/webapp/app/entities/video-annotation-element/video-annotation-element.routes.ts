import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { VideoAnnotationElementComponent } from './list/video-annotation-element.component';
import { VideoAnnotationElementDetailComponent } from './detail/video-annotation-element-detail.component';
import { VideoAnnotationElementUpdateComponent } from './update/video-annotation-element-update.component';
import VideoAnnotationElementResolve from './route/video-annotation-element-routing-resolve.service';

const videoAnnotationElementRoute: Routes = [
  {
    path: '',
    component: VideoAnnotationElementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VideoAnnotationElementDetailComponent,
    resolve: {
      videoAnnotationElement: VideoAnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VideoAnnotationElementUpdateComponent,
    resolve: {
      videoAnnotationElement: VideoAnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VideoAnnotationElementUpdateComponent,
    resolve: {
      videoAnnotationElement: VideoAnnotationElementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default videoAnnotationElementRoute;
