import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureDirectiveModule } from '@app/directives/feature/feature.module';
import { IconModule } from '@app/modules/icon/icon.module';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { DeletePromptComponent } from './delete-prompt/delete-prompt.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HeaderComponent, DeletePromptComponent],
  imports: [
    CommonModule,
    RouterModule,
    TippyModule,
    IconModule,
    RouterModule,
    DialogModule,
    ButtonsModule,
    FeatureDirectiveModule,
  ],
  exports: [HeaderComponent],
})
export class ComponentsModule {}
