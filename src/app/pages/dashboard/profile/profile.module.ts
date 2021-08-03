import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule, DeletePromptModule } from '@cartella/ui/components';
import { FeatureDirectiveModule, HoveredDirectiveModule } from '@cartella/ui/directives';
import { IconModule } from '@cartella/ui/modules';
import { MenuService } from '@cartella/ui/services';
import { DialogModule } from '@ngneat/dialog';
import { ColorTwitterModule } from 'ngx-color/twitter';
import { TagsAddComponent } from './components/modals/tags-add/tags-add.component';
import { ProfileGeneralComponent } from './components/profile-general/profile-general.component';
import { ProfileSidebarComponent } from './components/profile-sidebar/profile-sidebar.component';
import { ProfileTagsComponent } from './components/profile-tags/profile-tags.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileSidebarComponent,
    ProfileGeneralComponent,
    ProfileTagsComponent,
    TagsAddComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonsModule,
    IconModule,
    HoveredDirectiveModule,
    ColorTwitterModule,
    FeatureDirectiveModule,
    DeletePromptModule,
  ],
  providers: [MenuService],
})
export class ProfileModule {}
