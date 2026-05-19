import { Component } from '@angular/core';
import {PipelineComponent} from './app/components/pipeline/pipeline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PipelineComponent],
  template: `<app-pipeline />`
})
export class AppComponent {}
