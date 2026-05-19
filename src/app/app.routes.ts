import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./app/components/why-page/why-page')
        .then(m => m.WhyPage)
  },

  {
    path: 'pipeline',
    loadComponent: () =>
      import('./app/components/pipeline/pipeline')
        .then(m => m.PipelineComponent)
  }

];
