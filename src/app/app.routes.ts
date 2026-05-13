import { Routes } from '@angular/router';
import { canDeactivateGuard } from './core/guards/can-deactivate-guard';
import { roleGuard } from './core/guards/role-guard';

import { About } from './features/about/about';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Home } from './features/home/home';
import { LessonPage } from './features/lesson-page/lesson-page';
import { LevelTest } from './features/level-test/level-test';

export const routes: Routes = [
  // =========================
  // PUBLIC
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

  // =========================
  // LESSON DETAIL (slug)
  // =========================
  {
    path: 'levels/:level/:slug',
    component: LessonPage,
  },

  // =========================
  // LEVELS (DINÁMICO)
  // =========================
  {
    path: 'levels',
    loadComponent: () =>
      import('./features/students-home/students-home').then((m) => m.StudentsHome),
    data: { breadcrumb: 'Levels' },
  },

  {
    path: 'levels/:level',
    loadComponent: () => import('./features/levels/levels/levels').then((m) => m.Levels),
    data: { breadcrumb: 'Level' },
  },

  {
    path: 'irregular-verbs',
    loadComponent: () =>
      import('./features/levels/irregular-verbs/irregular-verbs').then((m) => m.IrregularVerbs),
  },

  // =========================
  // BLOG
  // =========================
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog/blog').then((m) => m.Blog),
  },
  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./features/blog/blog-detail/blog-detail').then((m) => m.BlogDetail),
  },

  // =========================
  // CONTACT
  // =========================
  {
    path: 'contact',
    loadComponent: () => import('./features/contact-form/contact-form').then((m) => m.ContactForm),
  },

  // =========================
  // AUTH
  // =========================
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  // =========================
  // LEVEL TEST
  // =========================
  {
    path: 'level-test',
    component: LevelTest,
  },

  // =========================
  // ADMIN
  // =========================
  {
    path: 'admin',
    loadComponent: () => import('./features/dashboard/admin/admin').then((m) => m.Admin),
  },

  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/dashboard/admin/users/users-list/users-list').then((m) => m.UsersList),
  },

  {
    path: 'admin/posts',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-list/posts-list').then(
        (m) => m.PostsList,
      ),
  },

  {
    path: 'admin/posts/create',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
  },

  {
    path: 'admin/posts/edit/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-form/posts-form').then(
        (m) => m.PostsForm,
      ),
  },

  {
    path: 'admin/posts/view/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/blog/posts/posts-view/posts-view').then(
        (m) => m.PostsView,
      ),
  },

  {
    path: 'admin/lessons',
    loadComponent: () =>
      import('./features/dashboard/admin/lessons/lessons-list/lessons-list').then(
        (m) => m.LessonsList,
      ),
  },

  {
    path: 'admin/lessons/create',
    loadComponent: () =>
      import('./features/dashboard/admin/lessons/lessons-form/lessons-form').then(
        (m) => m.LessonsForm,
      ),
  },

  {
    path: 'admin/lessons/edit/:id',
    loadComponent: () =>
      import('./features/dashboard/admin/lessons/lessons-form/lessons-form').then(
        (m) => m.LessonsForm,
      ),
  },

  // =========================
  // USER
  // =========================
  {
    path: 'user',
    loadComponent: () => import('./features/dashboard/user/user').then((m) => m.User),
    canActivate: [roleGuard(['user'])],
  },

  {
    path: 'user/settings',
    loadComponent: () =>
      import('./features/dashboard/user/configuration/configuration').then((m) => m.Configuration),
    canActivate: [roleGuard(['user', 'admin', 'teacher'])],
    canDeactivate: [canDeactivateGuard],
  },

  {
    path: 'user/favorite-posts',
    loadComponent: () =>
      import('./features/dashboard/user/favorite-posts/favorite-posts').then(
        (m) => m.FavoritePosts,
      ),
  },

  {
    path: 'user/tests-done',
    loadComponent: () =>
      import('./features/dashboard/user/tests-done/tests-done').then((m) => m.TestsDone),
  },

  {
    path: 'user/favorite-lessons',
    loadComponent: () =>
      import('./features/dashboard/user/favorite-lessons/favorite-lessons').then(
        (m) => m.FavoriteLessons,
      ),
  },

  {
    path: 'user/notes',
    loadComponent: () => import('./features/dashboard/user/notes/notes').then((m) => m.Notes),
  },

  // =========================
  // FALLBACK
  // =========================
  {
    path: '**',
    redirectTo: '',
  },
];
