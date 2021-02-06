import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileGeneralComponent } from './profile-general/profile-general.component';
import { ProfileTagsComponent } from './profile-tags/profile-tags.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', pathMatch: 'full', component: ProfileGeneralComponent },
      { path: 'tags', component: ProfileTagsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
