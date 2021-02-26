import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { PrimaryButtonComponent } from './primary-button/primary-button.component';
import { SecondaryButtonComponent } from './secondary-button/secondary-button.component';

@NgModule({
  declarations: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    IconButtonComponent,
  ],
  imports: [CommonModule],
  exports: [
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    IconButtonComponent,
  ],
})
export class ButtonsModule {}
