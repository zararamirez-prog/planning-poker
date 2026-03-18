import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/create-game/create-game').then(m => m.CreateGameComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];