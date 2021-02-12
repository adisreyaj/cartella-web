import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@app/components/components.module';
import { HoveredDirectiveModule } from '@app/directives/hovered/hovered-directive.module';
import { IconModule } from '@app/modules/icon/icon.module';
import { DialogModule } from '@ngneat/dialog';
import { ColorTwitterModule } from 'ngx-color/twitter';
import { ButtonsModule } from 'projects/ui/src/public-api';
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
    ComponentsModule,
    ColorTwitterModule,
  ],
})
export class ProfileModule {}
