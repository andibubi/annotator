import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'annotation',
    data: { pageTitle: 'Annotations' },
    loadChildren: () => import('./annotation/annotation.routes'),
  },
  {
    path: 'text-annotation-element',
    data: { pageTitle: 'TextAnnotationElements' },
    loadChildren: () => import('./text-annotation-element/text-annotation-element.routes'),
  },
  {
    path: 'video-annotation-element',
    data: { pageTitle: 'VideoAnnotationElements' },
    loadChildren: () => import('./video-annotation-element/video-annotation-element.routes'),
  },
  {
    path: 'layout',
    data: { pageTitle: 'Layouts' },
    loadChildren: () => import('./layout/layout.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
