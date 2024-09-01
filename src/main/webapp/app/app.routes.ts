import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

import HomeComponent from './home/home.component';
import NavbarComponent from './layouts/navbar/navbar.component';
import LoginComponent from './login/login.component';
import CreateAnnotationComponent from './create-annotation/create-annotation.component';
import CreateLayoutComponent from './create-layout/create-layout.component';
import ViewerComponent from './viewer/viewer.component';
import PlayerComponent from './player/player.component';
//import PlayerAltComponent from './player-alt/player-alt.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Annotator',
  },
  {
    path: '',
    component: NavbarComponent,
    outlet: 'navbar',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'login.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  {
    path: 'create-annotation',
    component: CreateAnnotationComponent,
    title: 'create-annotation.title',
  },
  {
    path: 'create-layout',
    component: CreateLayoutComponent,
    title: 'create-layout.title',
  },
  {
    path: 'play/:layoutId',
    component: PlayerComponent,
    title: 'play-annotation.title',
  },
  /*
  {
    path: 'play-alt/:layoutId',
    component: PlayerAltComponent,
    title: 'play-annotation.title',
  },
  */
  ...errorRoute,
];

export default routes;
