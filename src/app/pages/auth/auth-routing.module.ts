import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@cartella/config/routes.config';
import { FeatureGuard } from '@cartella/guards/feature.guard';
import { LoginHandlerComponent } from './login-handler/login-handler.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

const routes: Routes = [
  { path: ROUTES.auth.loginSuccess, component: LoginHandlerComponent },
  { path: ROUTES.auth.loginFailure, component: LoginHandlerComponent },
  { path: ROUTES.auth.login, component: LoginComponent },
  {
    path: ROUTES.auth.signup,
    component: SignUpComponent,
    canLoad: [FeatureGuard],
    data: {
      feature: 'signup',
    },
  },
  {
    path: ROUTES.auth.resetPassword,
    loadChildren: () => import('./reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
