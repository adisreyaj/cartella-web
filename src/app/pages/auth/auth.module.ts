import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginHandlerComponent } from './login-handler/login-handler.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

@NgModule({
  declarations: [LoginComponent, SignUpComponent, LoginHandlerComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ButtonsModule,
    ReactiveFormsModule,
    FeatureDirectiveModule,
  ],
})
export class AuthModule {}
