import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credential } from '../models/credential.model';

@Injectable({ providedIn: 'root' })
export class VaultApiService {
  private http = inject(HttpClient);
  private base = '/api/credentials';

  getAll(): Observable<Credential[]> {
    return this.http.get<Credential[]>(this.base);
  }

  getById(id: string): Observable<Credential> {
    return this.http.get<Credential>(`${this.base}/${id}`);
  }

  create(data: Partial<Credential>): Observable<Credential> {
    return this.http.post<Credential>(this.base, {
      ...data,
      ownerId: '', // Устанавливается на сервере по токену
      lastModified: new Date().toISOString(),
    });
  }

  update(id: string, data: Partial<Credential>): Observable<Credential> {
    return this.http.patch<Credential>(`${this.base}/${id}`, {
      ...data,
      lastModified: new Date().toISOString(),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}