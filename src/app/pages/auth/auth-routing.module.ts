import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureGuard } from '@app/guards/feature.guard';
import { LoginHandlerComponent } from './login-handler/login-handler.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

const routes: Routes = [
  { path: 'login/success', component: LoginHandlerComponent },
  { path: 'login/failure', component: LoginHandlerComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'signup',
    component: SignUpComponent,
    canLoad: [FeatureGuard],
    data: {
      feature: 'signup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
