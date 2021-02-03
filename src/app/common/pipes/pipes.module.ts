import { NgModule } from '@angular/core';
import { SanitizeHtmlPipe } from '@common/pipes/sanitaze-html.pipe';

@NgModule({
  declarations: [SanitizeHtmlPipe],
  exports: [SanitizeHtmlPipe]
})
export class PipesModule {}
