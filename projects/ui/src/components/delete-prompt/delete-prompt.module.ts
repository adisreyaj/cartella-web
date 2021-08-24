import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@cartella/ui/components';
import { IconModule } from '@cartella/ui/modules';
import { DialogModule } from '@ngneat/dialog';
import { DeletePromptComponent } from './delete-prompt.component';

@NgModule({
  declarations: [DeletePromptComponent],
  imports: [CommonModule, IconModule, DialogModule, ButtonsModule],
  exports: [DeletePromptComponent],
})
export class DeletePromptModule {}
