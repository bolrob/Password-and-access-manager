import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { VaultStore } from '../../store/vault.store';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiSelectModule, TuiDataListModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLoaderModule, TuiTableModule } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vault-list',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiButtonModule,
    TuiLoaderModule,
    TuiTableModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vault-container">
      <h2>Мои пароли</h2>
      <div class="controls">
        <tui-input [(ngModel)]="searchText" (ngModelChange)="onSearch($event)" placeholder="Поиск...">
          <tui-icon icon="tuiIconSearch"></tui-icon>
        </tui-input>
        <tui-select [(ngModel)]="selectedCategory" (ngModelChange)="onFilterCategory($event)">
          Категория
          <tui-data-list *tuiSelect>
            <button *ngFor="let cat of categories" tuiOption [value]="cat.value">{{ cat.label }}</button>
          </tui-data-list>
        </tui-select>
        <button tuiButton size="s" (click)="onSort('name')">По названию</button>
        <button tuiButton size="s" (click)="onSort('date')">По дате</button>
        <button tuiButton size="s" (click)="onSort('strength')">По надёжности</button>
      </div>

      <ng-container *ngIf="store.loading() else loaded">
        <tui-loader [showLoader]="true"></tui-loader>
      </ng-container>

      <ng-template #loaded>
        <table tuiTable>
          <thead>
            <tr>
              <th>Название</th>
              <th>Логин</th>
              <th>Категория</th>
              <th>Надёжность</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of store.filteredCredentials(); trackBy: trackById">
              <td>{{ c.name }}</td>
              <td>{{ c.login }}</td>
              <td>{{ c.category }}</td>
              <td>
                <app-password-strength-meter [password]="c.password"></app-password-strength-meter>
              </td>
              <td>
                <a [routerLink]="['/vault', c.id]">Открыть</a>
                <button (click)="delete(c.id)">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </ng-template>

      <button tuiButton routerLink="/vault/add">Добавить запись</button>
    </div>
  `,
  styles: [`
    .vault-container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .controls { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  `]
})
export class VaultListComponent {
  readonly store = inject(VaultStore);
  searchText = '';
  selectedCategory = 'all';

  categories = [
    { value: 'all', label: 'Все' },
    { value: 'work', label: 'Работа' },
    { value: 'personal', label: 'Личное' },
    { value: 'finance', label: 'Финансы' },
    { value: 'social', label: 'Соцсети' },
    { value: 'other', label: 'Другое' },
  ];

  onSearch(text: string): void {
    this.store.setFilter({ search: text });
  }

  onFilterCategory(cat: string): void {
    this.store.setFilter({ category: cat });
  }

  onSort(sortBy: 'name' | 'date' | 'strength'): void {
    this.store.setFilter({ sortBy });
  }

  delete(id: string): void {
    this.store.deleteCredential(id);
  }

  trackById(index: number, item: any): string {
    return item.id;
  }
}