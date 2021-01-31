import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoveredDirective } from './hovered.directive';



@NgModule({
  declarations: [HoveredDirective],
  imports: [
    CommonModule
  ],
  exports: [HoveredDirective]
})
export class HoveredDirectiveModule { }
