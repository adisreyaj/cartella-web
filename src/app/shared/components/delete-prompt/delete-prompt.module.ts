import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { DialogModule } from '@ngneat/dialog';
import { DeletePromptComponent } from './delete-prompt.component';

@NgModule({
  declarations: [DeletePromptComponent],
  imports: [CommonModule, IconModule, DialogModule],
  exports: [DeletePromptComponent],
})
export class DeletePromptModule {}
