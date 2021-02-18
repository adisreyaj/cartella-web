import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { FeatureGuard } from 'src/app/shared/guards/feature.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        canActivate: [FeatureGuard],
        data: {
          feature: 'home',
        },
      },
      {
        path: 'snippets',
        loadChildren: () =>
          import('./snippets/snippets.module').then((m) => m.SnippetsModule),
        canActivate: [FeatureGuard],
        data: {
          feature: 'snippets',
        },
      },
      {
        path: 'bookmarks',
        loadChildren: () =>
          import('./bookmarks/bookmarks.module').then((m) => m.BookmarksModule),
        canActivate: [FeatureGuard],
        data: {
          feature: 'bookmarks',
        },
      },
      {
        path: 'packages',
        loadChildren: () =>
          import('./packages/packages.module').then((m) => m.PackagesModule),
        canActivate: [FeatureGuard],
        data: {
          feature: 'packages',
        },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [FeatureGuard],
        data: {
          feature: 'profile',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
