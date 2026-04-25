// src/app/features/vault/components/vault-item/vault-item.component.ts
import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VaultApiService } from '../../services/vault-api.service';
import { Credential } from '../../models/credential.model';
import { VaultStore } from '../../store/vault.store';
import { PasswordStrengthMeterComponent } from '../../../../shared/components/password-strength-meter/password-strength-meter.component';
import { TuiButtonModule, TuiLoaderModule, TuiTagModule, TuiTooltipModule, TuiDialogModule, TuiNotificationModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-vault-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TuiButtonModule,
    TuiLoaderModule,
    TuiTagModule,
    TuiTooltipModule,
    TuiInputModule,
    TuiDialogModule,
    TuiNotificationModule,
    PasswordStrengthMeterComponent,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container" *ngIf="credential(); else loading">
      <h2>{{ credential()?.name }}</h2>
      <tui-tag [status]="categoryStatus" [value]="credential()?.category"></tui-tag>

      <div class="details">
        <div class="row">
          <label>Логин:</label>
          <span>{{ credential()?.login }}</span>
        </div>

        <div class="row">
          <label>Пароль:</label>
          <input tuiInput [value]="credential()?.password" [readOnly]="true" [type]="showPassword ? 'text' : 'password'" />
          <button tuiButton size="s" (click)="togglePassword()">Показать</button>
          <button tuiButton size="s" (click)="copyPassword()">Копировать</button>
        </div>

        <div class="row" *ngIf="credential()?.url">
          <label>URL:</label>
          <a [href]="credential()?.url" target="_blank">{{ credential()?.url }}</a>
        </div>

        <div class="row">
          <label>Надёжность:</label>
          <app-password-strength-meter [password]="credential()?.password || ''"></app-password-strength-meter>
        </div>

        <div class="row">
          <label>Последнее изменение:</label>
          <span>{{ credential()?.lastModified | date:'medium' }}</span>
        </div>

        <div class="row" *ngIf="credential()?.remindAfterDays">
          <label>Напоминание о смене:</label>
          <span>Через {{ credential()?.remindAfterDays }} дней</span>
        </div>
      </div>

      <div class="actions">
        <button tuiButton [routerLink]="['/vault', credential()?.id, 'edit']">Редактировать</button>
        <button tuiButton [routerLink]="['/vault', credential()?.id, 'history']">История паролей</button>
        <button tuiButton (click)="showDeleteDialog = true" appearance="accent">Удалить</button>
      </div>

      <ng-template [(tuiDialog)]="showDeleteDialog">
        <div class="dialog">
          <p>Вы уверены, что хотите удалить запись «{{ credential()?.name }}»?</p>
          <div class="dialog-actions">
            <button tuiButton (click)="showDeleteDialog = false">Отмена</button>
            <button tuiButton appearance="accent" (click)="delete()">Удалить</button>
          </div>
        </div>
      </ng-template>
    </div>

    <ng-template #loading>
    </ng-template>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    .details {
      margin-top: 20px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    label {
      font-weight: bold;
      width: 160px;
    }
    .actions {
      margin-top: 24px;
      display: flex;
      gap: 12px;
    }
    .dialog {
      padding: 20px;
      text-align: center;
    }
    .dialog-actions {
      margin-top: 16px;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
  `]
})
export class VaultItemComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vaultApi = inject(VaultApiService);
  private store = inject(VaultStore);

  credential = signal<Credential | null>(null);
  showPassword = false;
  showDeleteDialog = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCredential(id);
    }
  }

  async loadCredential(id: string): Promise<void> {
    try {
      const data = await lastValueFrom(this.vaultApi.getById(id));
      this.credential.set(data);
    } catch (err) {
      console.error('Ошибка загрузки записи', err);
      // Можно показать уведомление об ошибке
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  copyPassword(): void {
    const pass = this.credential()?.password;
    if (pass) {
      navigator.clipboard.writeText(pass);
      // Здесь можно показать уведомление об успешном копировании
    }
  }

  delete(): void {
    const id = this.credential()?.id;
    if (id) {
      this.store.deleteCredential(id);
      this.router.navigate(['/vault']);
    }
  }

  get categoryStatus(): string {
    const cat = this.credential()?.category;
    switch (cat) {
      case 'work': return 'primary';
      case 'finance': return 'success';
      case 'personal': return 'warning';
      default: return 'neutral';
    }
  }
}