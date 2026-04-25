import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/vault', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'vault',
    canActivate: [authGuard],
    loadChildren: () => import('./features/vault/vault.routes').then((m) => m.VAULT_ROUTES),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () => import('./features/settings/settings.routes'),
  },
  { path: '**', redirectTo: '/vault' },
];