import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { ButtonsModule } from '@cartella/ui';
import { TippyModule } from '@ngneat/helipopper';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, TippyModule, RouterModule, IconModule, ButtonsModule, FeatureDirectiveModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
