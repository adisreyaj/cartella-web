import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletePromptModule } from '@cartella/components/delete-prompt/delete-prompt.module';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { HoveredDirectiveModule } from '@cartella/directives/hovered/hovered-directive.module';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { MenuService } from '@cartella/services/menu/menu.service';
import { ButtonsModule } from '@cartella/ui';
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
