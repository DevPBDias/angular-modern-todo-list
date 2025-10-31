import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Hero } from './pages/hero/hero';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Hero,
      },
    ],
  },
];
