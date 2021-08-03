import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureDirective } from './feature.directive';

@NgModule({
  declarations: [FeatureDirective],
  imports: [CommonModule],
  exports: [FeatureDirective],
})
export class FeatureDirectiveModule {}
