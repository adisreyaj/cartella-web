import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SnippetsComponent } from './snippets.component';

const routes: Routes = [
  { path: '', component: SnippetsComponent },
  {
    path: ':slug',
    component: SnippetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnippetsRoutingModule {}
