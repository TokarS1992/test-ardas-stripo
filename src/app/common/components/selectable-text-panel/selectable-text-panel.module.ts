import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { SelectableTextPanelComponent } from '@common/components/selectable-text-panel/selectable-text-panel.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SelectableTextPanelComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class SelectableTextPanelModule { }
