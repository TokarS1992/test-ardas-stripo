import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TemplateService } from '@common/services/api/template.service';
import { NInMemoryData } from '@common/mocks/in-memory-data.models';
import ITemplate = NInMemoryData.ITemplate;

@Component({
  selector: 'stripo-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  public templates$: Observable<ReadonlyArray<ITemplate>>;
  public displayedColumns: (keyof ITemplate)[] = ['id', 'name', 'modified'];

  constructor(
    private templateService: TemplateService
  ) { }

  public ngOnInit(): void {
    this.templates$ = this.templateService.getTemplates();
  }
}
