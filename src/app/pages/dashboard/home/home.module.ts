import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@app/modules/icon/icon.module';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent, StatsCardComponent],
  imports: [CommonModule, HomeRoutingModule, IconModule],
})
export class HomeModule {}
