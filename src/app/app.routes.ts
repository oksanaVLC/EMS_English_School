import { Routes } from '@angular/router';
import { About } from './features/about/about';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Home } from './features/home/home';
import { LevelTest } from './features/level-test/level-test';

import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // =========================
  //  PÚBLICAS
  // =========================
  {
    path: '',
    component: Home,
    data: { breadcrumb: 'Inicio' },
  },
  {
    path: 'about',
    component: About,
    data: { breadcrumb: 'Sobre nosotros' },
  },

  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list/blog-list').then((m) => m.BlogList),
    data: { breadcrumb: 'Blog' },
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/blog/blog-detail/blog-detail').then((m) => m.BlogDetail),
    data: { breadcrumb: 'Artículo' },
  },

  // =========================
  //  AUTH
  // =========================
  {
    path: 'login',
    component: Login,
    data: { breadcrumb: false },
  },
  {
    path: 'register',
    component: Register,
    data: { breadcrumb: false },
  },

  // =========================
  //  LEVEL TEST
  // =========================
  {
    path: 'level-test',
    component: LevelTest,
    canActivate: [roleGuard(['admin', 'teacher', 'user'])],
    data: { breadcrumb: 'Test de nivel' },
  },

  // =========================
  //  DASHBOARD ADMIN
  // =========================
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./features/dashboard/admin/admin').then((m) => m.Admin),
    canActivate: [roleGuard(['admin'])],
    data: { breadcrumb: 'Admin' },
  },
  {
    path: 'dashboard/admin/users',
    loadComponent: () =>
      import('./features/dashboard/admin/users/users-list/users-list').then((m) => m.UsersList),
    canActivate: [roleGuard(['admin'])],
    data: { breadcrumb: 'Usuarios' },
  },
  {
    path: 'dashboard/admin/blog/posts',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-list/posts-list').then(
        (m) => m.PostsList,
      ),
    canActivate: [roleGuard(['admin'])],
    data: { breadcrumb: 'Posts' },
  },
  {
    path: 'dashboard/admin/blog/posts/create',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
    canActivate: [roleGuard(['admin'])],
    data: { breadcrumb: 'Crear post' },
  },
  {
    path: 'dashboard/admin/blog/posts/edit/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
    canActivate: [roleGuard(['admin'])],
    data: { breadcrumb: 'Editar post' },
  },
  {
    path: 'dashboard/admin/blog/posts/view/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-view/posts-view').then(
        (m) => m.PostsView,
      ),
    canActivate: [roleGuard(['admin'])],
    data: { breadcrumb: 'Ver post' },
  },

  // =========================
  //  DASHBOARD TEACHER
  // =========================
  {
    path: 'dashboard/teacher',
    loadComponent: () => import('./features/dashboard/teacher/teacher').then((m) => m.Teacher),
    canActivate: [roleGuard(['teacher'])],
    data: { breadcrumb: 'Profesor' },
  },

  // =========================
  //  DASHBOARD USER
  // =========================
  {
    path: 'dashboard/user',
    loadComponent: () => import('./features/dashboard/user/user').then((m) => m.User),
    canActivate: [roleGuard(['user'])],
    data: { breadcrumb: 'Panel usuario' },
  },
  {
    path: 'dashboard/user/settings',
    loadComponent: () =>
      import('./features/dashboard/user/configuration/configuration').then((m) => m.Configuration),
    canActivate: [roleGuard(['user', 'admin', 'teacher'])],
    data: { breadcrumb: 'Configuración' },
  },

  // =========================
  //  FALLBACK
  // =========================
  {
    path: '**',
    redirectTo: '',
  },
];
