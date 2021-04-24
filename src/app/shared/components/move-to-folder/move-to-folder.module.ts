import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { ButtonsModule } from '@cartella/ui';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { MoveToFolderComponent } from './move-to-folder.component';

@NgModule({
  declarations: [MoveToFolderComponent],
  imports: [
    CommonModule,
    IconModule,
    ButtonsModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [MoveToFolderComponent],
})
export class MoveToFolderModule {}
