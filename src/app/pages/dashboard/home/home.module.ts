import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@app/modules/icon/icon.module';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { SwiperModule } from 'swiper/angular';
import { HomeItemCardComponent } from './components/home-item-card/home-item-card.component';
import { HomeMostRecentlyAddedComponent } from './components/home-most-recently-added/home-most-recently-added.component';
import { HomeTopItemsComponent } from './components/home-top-items/home-top-items.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
    StatsCardComponent,
    HomeMostRecentlyAddedComponent,
    HomeItemCardComponent,
    HomeTopItemsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IconModule,
    ButtonsModule,
    SwiperModule,
  ],
})
export class HomeModule {}
