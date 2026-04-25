import { Routes } from '@angular/router';
import { VaultListComponent } from './components/vault-list/vault-list.component';
import { VaultFormComponent } from './components/vault-form/vault-form.component';
import { VaultItemComponent } from './components/vault-item/vault-item.component';

export const VAULT_ROUTES: Routes = [
  { path: '', component: VaultListComponent },
  { path: 'add', component: VaultFormComponent },
  { path: ':id', component: VaultItemComponent },
  { path: ':id/edit', component: VaultFormComponent },
];