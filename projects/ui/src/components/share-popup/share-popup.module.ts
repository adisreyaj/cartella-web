import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@cartella/ui';
import { IconModule } from '@cartella/ui/modules';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { SharePopupComponent } from './share-popup.component';

@NgModule({
  declarations: [SharePopupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonsModule,
    NgSelectModule,
    IconModule,
    HttpClientModule,
  ],
  exports: [SharePopupComponent],
})
export class SharePopupModule {}
