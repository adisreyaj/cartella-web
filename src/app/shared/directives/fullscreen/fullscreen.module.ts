import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FullscreenDirective } from './fullscreen.directive';

@NgModule({
  declarations: [FullscreenDirective],
  imports: [CommonModule],
  exports: [FullscreenDirective],
})
export class FullscreenModule {}
