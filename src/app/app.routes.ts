import { Routes } from '@angular/router';
import { canDeactivateGuard } from './core/guards/can-deactivate-guard';
import { roleGuard } from './core/guards/role-guard';
import { About } from './features/about/about';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { postResolver } from './features/blog/resolvers/post.resolver';
import { Home } from './features/home/home';
import { LevelTest } from './features/level-test/level-test';

export const routes: Routes = [
  // =========================
  //  PÚBLICAS
  // =========================
  {
    path: '',
    component: Home,
  },
  {
    path: 'about',
    component: About,
    data: { breadcrumb: 'Sobre nosotros' },
  },

  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog/blog').then((m) => m.Blog),
    data: { breadcrumb: 'Blog' },
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/blog/blog-detail/blog-detail').then((m) => m.BlogDetail),
    resolve: {
      post: postResolver,
    },
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
  //  ADMIN
  // =========================

  {
    path: 'admin',
    loadComponent: () => import('./features/dashboard/admin/admin').then((m) => m.Admin),
    data: { breadcrumb: 'Admin' },
  },

  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/dashboard/admin/users/users-list/users-list').then((m) => m.UsersList),
    data: { breadcrumb: 'Usuarios' },
  },

  {
    path: 'admin/posts',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-list/posts-list').then(
        (m) => m.PostsList,
      ),
    data: { breadcrumb: 'Posts' },
  },

  {
    path: 'admin/posts/create',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
    data: { breadcrumb: 'Crear post' },
  },

  {
    path: 'admin/posts/edit/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
    data: { breadcrumb: 'Editar post' },
  },

  {
    path: 'admin/posts/view/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-view/posts-view').then(
        (m) => m.PostsView,
      ),
    data: { breadcrumb: 'Ver post' },
  },

  // =========================
  //  TEACHER
  // =========================
  {
    path: 'teacher',
    loadComponent: () => import('./features/dashboard/teacher/teacher').then((m) => m.Teacher),
    canActivate: [roleGuard(['teacher'])],
    data: { breadcrumb: 'Profesor' },
  },

  // =========================
  //  USER
  // =========================
  {
    path: 'user',
    loadComponent: () => import('./features/dashboard/user/user').then((m) => m.User),
    canActivate: [roleGuard(['user'])],
    data: { breadcrumb: 'Panel usuario' },
  },
  {
    path: 'user/settings',
    loadComponent: () =>
      import('./features/dashboard/user/configuration/configuration').then((m) => m.Configuration),
    canActivate: [roleGuard(['user', 'admin', 'teacher'])],
    canDeactivate: [canDeactivateGuard],
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
