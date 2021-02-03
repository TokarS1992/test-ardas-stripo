import { AfterViewInit, Component, ElementRef, forwardRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { InMemoryBackendConfig, InMemoryBackendConfigArgs } from 'angular-in-memory-web-api';

import { from, fromEvent, merge, Observable, ObservedValueOf, timer } from 'rxjs';
import { debounceTime, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TemplateService } from '@common/services/api/template.service';
import { IRouteParams } from '@common/models/route.params';
import { NInMemoryData } from '@common/mocks/in-memory-data.models';
import { SelectableTextPanelComponent } from '@common/components/selectable-text-panel/selectable-text-panel.component';
import { AppComponent } from '../../app.component';
import { SelectableTextPanelService } from '@common/components/selectable-text-panel/selectable-text-panel.service';
import { NSelectablePanel } from '@common/components/selectable-text-panel/selectable-text-panel.models';
import ITemplate = NInMemoryData.ITemplate;
import InputSelectablePanel = NSelectablePanel.InputSelectablePanel;
import OutputSelectablePanel = NSelectablePanel.OutputSelectablePanel;

@UntilDestroy()
@Component({
  selector: 'stripo-template-once',
  templateUrl: './template-once.component.html',
  styleUrls: ['./template-once.component.scss']
})
export class TemplateOnceComponent implements OnInit, AfterViewInit {
  @ViewChild('templateRef', { read: ElementRef })
  public templateRef: ElementRef<HTMLDivElement>;
  public template$: Observable<ITemplate>;
  public get docSelection(): Selection {
    return this.doc.getSelection();
  }
  public get currentRange(): Range {
    return this.docSelection.getRangeAt(0);
  }
  public get currentSelectionContent() {
    return this.docSelection.toString();
  }

  private matSnackBarRef: MatSnackBarRef<SelectableTextPanelComponent>;

  constructor(
    private inMemoryBackendConfig: InMemoryBackendConfig,
    private templateService: TemplateService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private selectableTextPanelService: SelectableTextPanelService,
    private renderer2: Renderer2,
    @Inject(forwardRef(() => AppComponent)) private appComponent: AppComponent, // Get app component instance
    @Inject(DOCUMENT) private readonly doc: Document
  ) { }

  public ngOnInit(): void {
    this._getData();
  }

  public ngAfterViewInit(): void {
    this._buildSubscribers();
  }

  // Build subscribers
  private _buildSubscribers(): void {
    const inMemoryDelay = (this.inMemoryBackendConfig as InMemoryBackendConfigArgs).delay || 0;

    fromEvent(this.appComponent.appContainer, 'click').pipe(
      filter(() => this.matSnackBarRef && this.currentSelectionContent.length === 0),
      untilDestroyed(this)
    ).subscribe(() => {
      this.docSelection.empty();
      this.matSnackBarRef.dismiss()
    });

    timer(inMemoryDelay).pipe(
      switchMap(() => merge(
        this._openEditableElemsPanel$(),
        this._changeEditableElems$()
      )),
      switchMap((newTemplate) => this.templateService.putTemplate(newTemplate)),
      untilDestroyed(this)
    ).subscribe((_: ITemplate) => {
      console.log('Success update');
    });
  }

  // Use api for getting data about current template
  private _getData(): void {
    const templateIdByRouteParams = (this.activatedRoute.snapshot.params as IRouteParams).templateId;
    this.template$ = this.templateService.getTemplateById(templateIdByRouteParams).pipe(
      shareReplay(1)
    );
  }

  // Getter stream for editable elements
  private get _getEditableElems$(): Observable<ObservedValueOf<any>> {
    return from(Array.from(this.doc.getElementsByClassName('editable')));
  }

  // Return MOUSEUP event stream by editable elements and after that return new template stream
  private _openEditableElemsPanel$(): Observable<ITemplate> {
    let tempRange: Range;

    return this._getEditableElems$.pipe(
      mergeMap((el: HTMLElement) => fromEvent(el, 'mouseup').pipe(
        filter(() => this.currentSelectionContent.length > 0),
        tap(() => tempRange = this.currentRange),
        filter(() => tempRange.startContainer == tempRange.endContainer),
        switchMap(() => this._openSnackBarPanel(el, tempRange)),
        tap(({ fontSize }) => {
          const parentElementByRange = tempRange.startContainer.parentElement;
          const fontSizePx = `${fontSize}px`;

          if (parentElementByRange !== el) {
            if (tempRange.toString() !== parentElementByRange.innerText) {
              this._rangeSurroundContents(tempRange, fontSizePx);
            } else {
              this.renderer2.setStyle(parentElementByRange, 'fontSize', fontSizePx);
            }
          } else {
            this._rangeSurroundContents(tempRange, fontSizePx);
          }
        }),
        tap(() => this.docSelection.empty())
      )),
      switchMap(() => this._getNewTemplate$())
    );
  }

  // Return INPUT event stream by editable elements and after that return new template stream
  private _changeEditableElems$(): Observable<ITemplate> {
    const mergeMapCallback$ = (el: HTMLElement) => fromEvent(el, 'input').pipe(
      debounceTime(500)
    );

    return this._getEditableElems$.pipe(
      mergeMap(mergeMapCallback$),
      switchMap(() => this._getNewTemplate$())
    );
  }

  // Return stream with new template and modified properties
  private _getNewTemplate$(): Observable<ITemplate> {
    const newTemplate = this.templateRef.nativeElement.innerHTML;

    return this.template$.pipe(
      map((template) => ({
        ...template,
        template: newTemplate,
        modified: Date.now()
      }))
    );
  }

  // Open snackbar and set property fontSize if range has wrap element. Return stream
  private _openSnackBarPanel(parentEl: HTMLElement, range: Range): Observable<OutputSelectablePanel> {
    const parentElementByRange = range.startContainer.parentElement;
    const snackBarData: InputSelectablePanel = {};

    if (parentElementByRange !== parentEl) {
      snackBarData.fontSize = parseInt(parentElementByRange.style.fontSize);
    }

    this.matSnackBarRef = this.matSnackBar.openFromComponent(SelectableTextPanelComponent, {
      duration: Infinity,
      horizontalPosition: 'start',
      verticalPosition: 'top',
      data: snackBarData
    });

    return this.matSnackBarRef.afterDismissed().pipe(
      switchMap(() => this.selectableTextPanelService.afterCloseData$),
      filter((d) => !!d)
    );
  }

  // Create span and set this font size, Use range.surroundContents(node) method
  private _rangeSurroundContents(range: Range, fontSizeWrapElPx: string): void {
    const wrapElement: HTMLSpanElement = this.renderer2.createElement('span');
    this.renderer2.setStyle(wrapElement, 'fontSize', fontSizeWrapElPx);
    range.surroundContents(wrapElement);
  }
}
