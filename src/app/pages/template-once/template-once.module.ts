import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateOnceComponent } from './template-once.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectableTextPanelModule } from '@common/components/selectable-text-panel/selectable-text-panel.module';
import { PipesModule } from '@common/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: TemplateOnceComponent
  }
];

@NgModule({
  declarations: [TemplateOnceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SelectableTextPanelModule,
    MatIconModule,
    MatSnackBarModule,
    PipesModule
  ],
  exports: [RouterModule]
})
export class TemplateOnceModule {}
