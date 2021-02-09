import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HoveredDirectiveModule } from '@app/directives/hovered/hovered-directive.module';
import { IconModule } from '@app/modules/icon/icon.module';
import { TimeAgoPipeModule } from '@app/pipes/time-ago-pipe/time-ago-pipe.module';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { SwiperModule } from 'swiper/angular';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeItemCardComponent } from './shared/components/home-item-card/home-item-card.component';
import { HomeMostRecentlyAddedComponent } from './shared/components/home-most-recently-added/home-most-recently-added.component';
import { HomeTopItemsComponent } from './shared/components/home-top-items/home-top-items.component';
import { StatsCardComponent } from './shared/components/stats-card/stats-card.component';

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
    HoveredDirectiveModule,
    TimeAgoPipeModule,
  ],
})
export class HomeModule {}
