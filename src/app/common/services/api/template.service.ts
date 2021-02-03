import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { NInMemoryData } from '../../mocks/in-memory-data.models';
import ITemplate = NInMemoryData.ITemplate;

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(
    private http: HttpClient
  ) { }

  public getTemplates(): Observable<ITemplate[]> {
    return this.http.get<ITemplate[]>('/api/templates');
  }

  public getTemplateById(templateId: string): Observable<ITemplate> {
    return this.http.get<ITemplate>(`/api/templates/${templateId}`);
  }

  public putTemplate(newTemplateBody: ITemplate): Observable<ITemplate> {
    return this.http.put<ITemplate>(`/api/templates/${newTemplateBody.id}`, newTemplateBody);
  }
}
