import { Routes } from '@angular/router';
import { About } from './features/about/about';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Home } from './features/home/home';
import { LevelTest } from './features/level-test/level-test';

import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // Públicas
  { path: '', component: Home },
  { path: 'about', component: About },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list/blog-list').then((m) => m.BlogList),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/blog/blog-detail/blog-detail').then((m) => m.BlogDetail),
  },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Protegido (todos los roles)
  {
    path: 'level-test',
    component: LevelTest,
    canActivate: [roleGuard(['admin', 'teacher', 'user'])],
  },

  //  Dashboards protegidos
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./features/dashboard/admin/admin').then((m) => m.Admin),
    canActivate: [roleGuard(['admin'])],
  },

  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/dashboard/admin/users/users-list/users-list').then((m) => m.UsersList),
    canActivate: [roleGuard(['admin'])],
  },
  {
    path: 'admin/blog/posts',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-list/posts-list').then(
        (m) => m.PostsList,
      ),
    canActivate: [roleGuard(['admin'])],
  },
  {
    path: 'admin/blog/posts/create',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
    canActivate: [roleGuard(['admin'])],
  },
  {
    path: 'admin/blog/posts/edit/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
    canActivate: [roleGuard(['admin'])],
  },
  {
    path: 'admin/blog/posts/view/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-view/posts-view').then(
        (m) => m.PostsView,
      ),
    canActivate: [roleGuard(['admin'])],
  },

  {
    path: 'dashboard/teacher',
    loadComponent: () => import('./features/dashboard/teacher/teacher').then((m) => m.Teacher),
    canActivate: [roleGuard(['teacher'])],
  },
  {
    path: 'dashboard/user',
    loadComponent: () => import('./features/dashboard/user/user').then((m) => m.User),
    canActivate: [roleGuard(['user'])],
  },

  // fallback
  { path: '**', redirectTo: '' },
];
