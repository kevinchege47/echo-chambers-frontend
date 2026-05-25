import {Injectable, inject, Provider} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import {AIProvider, FactRequest, PipelineResponse} from '../models/models';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MisinformationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  analyze(request: FactRequest): Observable<PipelineResponse> {
    return this.http.post<PipelineResponse>(`${this.apiUrl}/api/analyze`, request);
  }





  getProviders(): Observable<{ providers: AIProvider[] }> {
    return this.http.get<{ providers: AIProvider[] }>(`${this.apiUrl}/api/providers`);
  }
}
