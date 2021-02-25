import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@app/modules/icon/icon.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { ButtonsModule } from 'projects/ui/src/public-api';
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
