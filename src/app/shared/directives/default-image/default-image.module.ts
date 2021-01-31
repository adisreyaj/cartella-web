import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DefaultImageDirective } from './default-image.directive';

@NgModule({
  declarations: [DefaultImageDirective],
  imports: [CommonModule],
  exports: [DefaultImageDirective],
})
export class DefaultImageModule {}
