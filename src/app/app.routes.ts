import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'launch-screen',
    pathMatch: 'full',
  },
  {
    path: 'arpa',
    loadComponent: () => import('./arpa/arpa.page').then( m => m.ArpaPage)
  },
  {
    path: 'ricette',
    loadComponent: () => import('./ricette/ricette.page').then( m => m.RicettePage)
  },
  {
    path: 'semi',
    loadComponent: () => import('./semi/semi.page').then( m => m.SemiPage)
  },
  {
    path: 'mappa',
    loadComponent: () => import('./mappa/mappa.page').then( m => m.MappaPage)
  },
  {
    path: 'launch-screen',
    loadComponent: () => import('./launch-screen/launch-screen.page').then( m => m.LaunchScreenPage)
  },
  {
    path: 'dettagli-semi/:id',
    loadComponent: () => import('./semi/dettagli-semi/dettagli-semi.page').then( m => m.DettagliSemiPage)
  },
  {
    path: 'dettagli-ricette/:id',
    loadComponent: () => import('./ricette/dettagli-ricette/dettagli-ricette.page').then( m => m.DettagliRicettePage)
  },
];
