import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { ButtonsModule } from '@cartella/ui';
import { DialogModule } from '@ngneat/dialog';
import { DeletePromptComponent } from './delete-prompt.component';

@NgModule({
  declarations: [DeletePromptComponent],
  imports: [CommonModule, IconModule, DialogModule, ButtonsModule],
  exports: [DeletePromptComponent],
})
export class DeletePromptModule {}
