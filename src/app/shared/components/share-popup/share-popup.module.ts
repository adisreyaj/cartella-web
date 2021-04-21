import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { IconModule } from '../../modules/icon/icon.module';
import { SharePopupComponent } from './share-popup.component';

@NgModule({
  declarations: [SharePopupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonsModule,
    NgSelectModule,
    IconModule,
    HttpClientModule,
  ],
  exports: [SharePopupComponent],
})
export class SharePopupModule {}
