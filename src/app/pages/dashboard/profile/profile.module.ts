import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@app/components/components.module';
import { HoveredDirectiveModule } from '@app/directives/hovered/hovered-directive.module';
import { IconModule } from '@app/modules/icon/icon.module';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ProfileGeneralComponent } from './profile-general/profile-general.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { ProfileTagsComponent } from './profile-tags/profile-tags.component';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileSidebarComponent,
    ProfileGeneralComponent,
    ProfileTagsComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonsModule,
    IconModule,
    HoveredDirectiveModule,
    ComponentsModule,
  ],
})
export class ProfileModule {}
