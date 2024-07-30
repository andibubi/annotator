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
    path: 'annotation-element',
    data: { pageTitle: 'AnnotationElements' },
    loadChildren: () => import('./annotation-element/annotation-element.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
