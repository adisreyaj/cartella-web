import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureGuard } from '@app/guards/feature.guard';
import { ProfileGeneralComponent } from './components/profile-general/profile-general.component';
import { ProfileTagsComponent } from './components/profile-tags/profile-tags.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', pathMatch: 'full', component: ProfileGeneralComponent },
      {
        path: 'tags',
        component: ProfileTagsComponent,
        canLoad: [FeatureGuard],
        data: {
          feature: 'tags',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
