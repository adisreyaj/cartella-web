import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { ButtonsModule } from '@cartella/ui';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
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
