import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButtonDirective } from './primary-button.directive';
import { SecondaryButtonDirective } from './secondary-button.directive';
import { IconButtonDirective } from './icon-button.directive';

@NgModule({
  declarations: [
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    IconButtonDirective,
  ],
  imports: [CommonModule],
  exports: [
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    IconButtonDirective,
  ],
})
export class ButtonsModule {}
