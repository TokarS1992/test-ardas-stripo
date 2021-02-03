import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'stripo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('appContainerRef', { read: ElementRef }) private _appContainerRef: ElementRef<HTMLDivElement>;

  public get appContainer() {
    return this._appContainerRef.nativeElement;
  }
}
