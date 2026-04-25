import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Credential } from '../models/credential.model';
import { VaultApiService } from '../services/vault-api.service';
import { lastValueFrom } from 'rxjs';

interface VaultState {
  credentials: Credential[];
  loading: boolean;
  error: string | null;
  filter: {
    search: string;
    category: string;
    sortBy: 'name' | 'date' | 'strength';
  };
}

const initialState: VaultState = {
  credentials: [],
  loading: false,
  error: null,
  filter: { search: '', category: 'all', sortBy: 'name' },
};

export const VaultStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ credentials, filter }) => ({
    filteredCredentials: computed(() => {
      let result = credentials();
      const { search, category, sortBy } = filter();

      // поиск по названию и тегам
      if (search) {
        const term = search.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.tags.some((t) => t.toLowerCase().includes(term))
        );
      }

      // фильтр по категории
      if (category !== 'all') {
        result = result.filter((c) => c.category === category);
      }

      // сортировка
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'date':
            return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
          case 'strength':
            return a.strength - b.strength;
          default:
            return 0;
        }
      });

      return result;
    }),
  })),
  withMethods((store, vaultApi = inject(VaultApiService)) => ({
    async loadCredentials() {
      patchState(store, { loading: true, error: null });
      try {
        const data = await lastValueFrom(vaultApi.getAll());
        patchState(store, { credentials: data, loading: false });
      } catch (err: any) {
        patchState(store, { loading: false, error: err.message || 'Ошибка загрузки' });
      }
    },
    async addCredential(credential: Partial<Credential>) {
      patchState(store, { loading: true });
      try {
        await lastValueFrom(vaultApi.create(credential));
        await this.loadCredentials();
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async updateCredential(id: string, changes: Partial<Credential>) {
      patchState(store, { loading: true });
      try {
        await lastValueFrom(vaultApi.update(id, changes));
        await this.loadCredentials();
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async deleteCredential(id: string) {
      patchState(store, { loading: true });
      try {
        await lastValueFrom(vaultApi.delete(id));
        await this.loadCredentials();
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    setFilter(filter: Partial<VaultState['filter']>) {
      patchState(store, { filter: { ...store.filter(), ...filter } });
    },
  })),
  withHooks({
    onInit({ loadCredentials }) {
      loadCredentials();
    },
  })
);