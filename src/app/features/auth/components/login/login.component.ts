import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiButtonModule,
    TuiNotificationModule,
  ],
  template: `
    <div class="auth-container">
      <h2>Вход</h2>
      <form [formGroup]="loginForm" (ngSubmit)="submit()">
        <tui-input formControlName="email" type="email" tuiTextfieldLabel="Email"></tui-input>
        <tui-input-password formControlName="password" tuiTextfieldLabel="Пароль"></tui-input-password>
        <button tuiButton size="m" type="submit" [disabled]="loginForm.invalid">Войти</button>
      </form>
      <p>Нет аккаунта? <a routerLink="/auth/register">Зарегистрироваться</a></p>
    </div>
  `,
  styles: [`
    .auth-container { max-width: 400px; margin: 40px auto; padding: 20px; }
    form > * { display: block; margin-bottom: 16px; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.loginForm.invalid) return;
    this.auth.login(this.loginForm.value as any).subscribe({
      next: () => this.router.navigate(['/vault']),
      error: (err) => console.error('Ошибка входа', err),
    });
  }
}