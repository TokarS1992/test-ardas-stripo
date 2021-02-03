import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'template-list'
  },
  {
    path: 'template-list',
    loadChildren: () => import('@pages/template-list/template-list.module').then((m) => m.TemplateListModule)
  },
  {
    path: 'template-list/:templateId',
    loadChildren: () => import('@pages/template-once/template-once.module').then((m) => m.TemplateOnceModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
