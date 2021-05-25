/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES, ROUTE_DATA } from '@cartella/config/routes.config';
import { AuthGuard } from '@cartella/guards/auth.guard';
import { FeatureGuard } from '@cartella/guards/feature.guard';
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
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
        canLoad: [FeatureGuard],
        data: ROUTE_DATA.home,
      },
      {
        path: ROUTES.dashboard.snippets,
        loadChildren: () => import('@cartella/snippets/module').then((m) => m.SnippetsModule),
        canLoad: [FeatureGuard],
        data: ROUTE_DATA.snippets,
      },
      {
        path: ROUTES.dashboard.bookmarks,
        loadChildren: () => import('@cartella/bookmarks/module').then((m) => m.BookmarksModule),
        canLoad: [FeatureGuard],
        data: ROUTE_DATA.bookmarks,
      },
      {
        path: ROUTES.dashboard.packages,
        loadChildren: () => import('@cartella/packages/module').then((m) => m.PackagesModule),
        canLoad: [FeatureGuard],
        data: ROUTE_DATA.packages,
      },
      {
        path: ROUTES.dashboard.profile,
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
        canLoad: [FeatureGuard],
        data: ROUTE_DATA.profile,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
