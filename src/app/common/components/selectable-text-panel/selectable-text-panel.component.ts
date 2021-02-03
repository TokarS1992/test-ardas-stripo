import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { NSelectablePanel } from '@common/components/selectable-text-panel/selectable-text-panel.models';
import InputSelectablePanel = NSelectablePanel.InputSelectablePanel;
import { SelectableTextPanelService } from '@common/components/selectable-text-panel/selectable-text-panel.service';

const initialData: InputSelectablePanel = {
  fontSize: 16
};

const FONT_SIZES: ReadonlyArray<number> = new Array(72)
  .fill('')
  .map((_, index) => index + 1)
  .filter((item) => item >= 8);

@Component({
  selector: 'stripo-selectable-text-panel',
  templateUrl: './selectable-text-panel.component.html',
  styleUrls: ['./selectable-text-panel.component.scss']
})
export class SelectableTextPanelComponent implements OnInit {
  public readonly fontSizeControl = new FormControl();
  public fontSizes: ReadonlyArray<number> = FONT_SIZES;

  constructor(
    private snackBarRef: MatSnackBarRef<SelectableTextPanelComponent>,
    private selectableTextPanelService: SelectableTextPanelService,
    @Inject(MAT_SNACK_BAR_DATA) public readonly data: InputSelectablePanel
  ) {
    this.data = Object.assign({}, initialData, this.data);
  }

  public ngOnInit(): void {
    this.fontSizeControl.setValue(this.data.fontSize);
  }

  public close(): void {
    this.selectableTextPanelService.setData({
      fontSize: this.fontSizeControl.value
    });

    this.snackBarRef.dismiss();
  }
}
