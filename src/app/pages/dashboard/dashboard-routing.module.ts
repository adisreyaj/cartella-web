/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@cartella/env/environment';
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
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'home',
          title: 'Cartella - All in one dev bookmark tool!',
          description: `Bookmark your favorite articles, libraries, code snippets and more.
          One place to collect them all.`,
          ogUrl: `${environment.hostname}`,
        },
      },
      {
        path: 'snippets',
        loadChildren: () =>
          import('./snippets/snippets.module').then((m) => m.SnippetsModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'snippets',
          title: 'Snippets - Manage your code snippets! | Cartella',
          description: `Saw a really cool code snippet on the internet or want to save those repetitive code snippets? Cartella has you covered. Save and share your favorite code snippets with ease.`,
          ogUrl: `${environment.hostname}/snippets`,
        },
      },
      {
        path: 'bookmarks',
        loadChildren: () =>
          import('./bookmarks/bookmarks.module').then((m) => m.BookmarksModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'bookmarks',
          title: 'Bookmarks - Manage your articles and blogs! | Cartella',
          description: `Save all your favorite articles and blogs in one place so that you will never miss those gems. Organize them in folders and add tags to easily find what you are looking for.`,
          ogUrl: `${environment.hostname}/bookmarks`,
        },
      },
      {
        path: 'packages',
        loadChildren: () =>
          import('./packages/packages.module').then((m) => m.PackagesModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'packages',
          title: 'Package - Organize your favorite libraries | Cartella',
          description: `Did you come across some awesome library someone shared on twitter, and want to save it for later so that you will never forget the name? Packages section can help you add your favorite libraries with ease`,
          ogUrl: `${environment.hostname}/packages`,
        },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        canLoad: [FeatureGuard],
        data: {
          feature: 'profile',
          title: 'Profile - Manage your profile  | Cartella',
          description: `Bookmark your favorite articles, libraries, code snippets and more.
          One place to collect them all.`,
          ogUrl: `${environment.hostname}/profile`,
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
