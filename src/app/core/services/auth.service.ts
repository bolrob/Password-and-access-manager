import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(data: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', data).pipe(
      tap((res) => localStorage.setItem('token', res.token))
    );
  }

  register(data: RegisterRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/register', data).pipe(
      tap((res) => localStorage.setItem('token', res.token))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}