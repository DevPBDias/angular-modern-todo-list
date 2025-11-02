import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Hero } from './pages/hero/hero';
import { TodoList } from './pages/todo-list/todo-list';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Hero,
      },
      {
        path: 'todo-list',
        component: TodoList,
      },
    ],
  },
];
