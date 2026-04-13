import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'orders', loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'workers', loadComponent: () => import('./features/workers/workers.component').then(m => m.WorkersComponent) },
  { path: 'my-work', loadComponent: () => import('./features/worker-portal/worker-portal.component').then(m => m.WorkerPortalComponent) },
];
