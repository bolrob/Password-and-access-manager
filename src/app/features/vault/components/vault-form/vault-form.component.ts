import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { VaultStore } from '../../store/vault.store';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiInputModule, TuiInputPasswordModule, TuiSelectModule, TuiDataListModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { PasswordGeneratorComponent } from '../password-generator/password-generator.component';

@Component({
  selector: 'app-vault-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiButtonModule,
    PasswordGeneratorComponent,
  ],
  template: `
    <div class="form-container">
      <h2>{{ isEdit ? 'Редактировать' : 'Добавить' }} запись</h2>
      <form [formGroup]="form" (ngSubmit)="save()">
        <tui-input formControlName="name" tuiTextfieldLabel="Название"></tui-input>
        <tui-input formControlName="login" tuiTextfieldLabel="Логин"></tui-input>
        <tui-input-password formControlName="password" tuiTextfieldLabel="Пароль"></tui-input-password>
        <app-password-generator (generate)="form.patchValue({ password: $event })"></app-password-generator>
        <tui-select formControlName="category" tuiTextfieldLabel="Категория">
          <tui-data-list *tuiSelect>
            <button *ngFor="let c of categories" tuiOption [value]="c.value">{{ c.label }}</button>
          </tui-data-list>
        </tui-select>
        <tui-input formControlName="remindAfterDays" type="number" tuiTextfieldLabel="Напомнить через (дней)"></tui-input>
        <button tuiButton size="m" type="submit" [disabled]="form.invalid">Сохранить</button>
      </form>
    </div>
  `,
  styles: [`.form-container { max-width: 600px; margin: 20px auto; } form > * { margin-bottom: 16px; }`]
})
export class VaultFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(VaultStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isEdit = false;
  credentialId?: string;

  categories = [
    { value: 'work', label: 'Работа' },
    { value: 'personal', label: 'Личное' },
    { value: 'finance', label: 'Финансы' },
    { value: 'social', label: 'Соцсети' },
    { value: 'other', label: 'Другое' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    login: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    category: ['other'],
    remindAfterDays: [null],
  });

  ngOnInit(): void {
    this.credentialId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.credentialId) {
      this.isEdit = true;
      // Загрузить существующие данные и заполнить форму (упрощённо, в реальном проекте добавить запрос)
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const data = this.form.value as any;
    if (this.isEdit && this.credentialId) {
      this.store.updateCredential(this.credentialId, data);
    } else {
      this.store.addCredential(data);
    }
    this.router.navigate(['/vault']);
  }
}