import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app/components/pipeline/pipeline')
        .then(m => m.PipelineComponent)
  },
  {
    path: 'why',
    loadComponent: () =>
      import('./app/components/why-page/why-page')
        .then(m => m.WhyPage)
  }
];
