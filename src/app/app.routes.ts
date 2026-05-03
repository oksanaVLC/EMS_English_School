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
    path: 'students',
    data: { breadcrumb: 'Recursos' },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/students-home/students-home').then((m) => m.StudentsHome),
      },

      // =========================
      // LEVELS
      // =========================
      {
        path: 'a1',
        loadComponent: () =>
          import('./features/levels/beginner-a1/beginner-a1').then((m) => m.BeginnerA1),
        data: { breadcrumb: 'Nivel A1' },
      },
      {
        path: 'a2',
        loadComponent: () =>
          import('./features/levels/elementary-a2/elementary-a2').then((m) => m.ElementaryA2),
        data: { breadcrumb: 'Nivel A2' },
      },
      {
        path: 'b1',
        loadComponent: () =>
          import('./features/levels/intermediate-b1/intermediate-b1').then((m) => m.IntermediateB1),
        data: { breadcrumb: 'Nivel B1' },
      },
      {
        path: 'b2',
        loadComponent: () =>
          import('./features/levels/upper-intermediate-b2/upper-intermediate-b2').then(
            (m) => m.UpperIntermediateB2,
          ),
        data: { breadcrumb: 'Nivel B2' },
      },
      {
        path: 'c1',
        loadComponent: () =>
          import('./features/levels/advanced-c1/advanced-c1').then((m) => m.AdvancedC1),
        data: { breadcrumb: 'Nivel C1' },
      },
      {
        path: 'c2',
        loadComponent: () =>
          import('./features/levels/proficiency-c2/proficiency-c2').then((m) => m.ProficiencyC2),
        data: { breadcrumb: 'Nivel C2' },
      },
    ],
  },

  {
    path: 'teachers',
    loadComponent: () =>
      import('./features/teachers-home/teachers-home').then((m) => m.TeachersHome),
    data: { breadcrumb: 'Profesores' },
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
    data: { breadcrumb: 'Artículo' },
  },

  {
    path: 'contact',
    loadComponent: () => import('./features/contact-form/contact-form').then((m) => m.ContactForm),
    data: { breadcrumb: 'Contacto' },
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
  //  USER
  // =========================
  {
    path: 'user',
    loadComponent: () => import('./features/dashboard/user/user').then((m) => m.User),
    canActivate: [roleGuard(['user'])],
    data: { breadcrumb: 'Panel del usuario' },
  },
  {
    path: 'user/settings',
    loadComponent: () =>
      import('./features/dashboard/user/configuration/configuration').then((m) => m.Configuration),
    canActivate: [roleGuard(['user', 'admin', 'teacher'])],
    canDeactivate: [canDeactivateGuard],
    data: { breadcrumb: 'Configuración' },
  },
  {
    path: 'user/favorite-posts',
    loadComponent: () =>
      import('./features/dashboard/user/favorite-posts/favorite-posts').then(
        (m) => m.FavoritePosts,
      ),
    data: { breadcrumb: 'Articulos guardados' },
  },

  // =========================
  //  FALLBACK
  // =========================
  {
    path: '**',
    redirectTo: '',
  },
];
