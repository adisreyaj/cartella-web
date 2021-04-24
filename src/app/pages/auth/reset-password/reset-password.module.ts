import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { ButtonsModule } from '@cartella/ui';
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
