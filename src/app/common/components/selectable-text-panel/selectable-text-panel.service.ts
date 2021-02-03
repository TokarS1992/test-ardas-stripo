import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NSelectablePanel } from '@common/components/selectable-text-panel/selectable-text-panel.models';
import OutputSelectablePanel = NSelectablePanel.OutputSelectablePanel;

@Injectable({
  providedIn: 'root'
})
export class SelectableTextPanelService {
  private afterClosePanelData = new BehaviorSubject<OutputSelectablePanel>(null);

  public readonly afterCloseData$: Observable<OutputSelectablePanel> = this.afterClosePanelData.asObservable();

  constructor() {}

  public setData(data: OutputSelectablePanel): void {
    this.afterClosePanelData.next(data);
  }
}
