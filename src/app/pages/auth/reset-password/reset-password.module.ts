import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureDirectiveModule } from '@app/directives/feature/feature.module';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    FormsModule,
    FeatureDirectiveModule,
    ButtonsModule,
    ReactiveFormsModule,
  ],
})
export class ResetPasswordModule {}
