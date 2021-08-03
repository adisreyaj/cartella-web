import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonsModule } from '@cartella/ui/components';
import { HoveredDirectiveModule } from '@cartella/ui/directives';
import { IconModule } from '@cartella/ui/modules';
import { TimeAgoPipeModule } from '@cartella/ui/pipes';
import { BaseStorageService } from '@cartella/ui/services';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { SwiperModule } from 'swiper/angular';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeItemCardComponent } from './shared/components/home-item-card/home-item-card.component';
import { HomeMostRecentlyAddedComponent } from './shared/components/home-most-recently-added/home-most-recently-added.component';
import { HomeTopItemsComponent } from './shared/components/home-top-items/home-top-items.component';
import { StatsCardComponent } from './shared/components/stats-card/stats-card.component';
import { HomeCardDataFormatPipe } from './shared/pipes/home-card-data-format.pipe';
import { HomeStorageService } from './shared/services/home-storage.service';
import { HomeState } from './shared/store/states/home.state';

@NgModule({
  declarations: [
    HomeComponent,
    StatsCardComponent,
    HomeMostRecentlyAddedComponent,
    HomeItemCardComponent,
    HomeTopItemsComponent,
    HomeCardDataFormatPipe,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IconModule,
    ButtonsModule,
    SwiperModule,
    HoveredDirectiveModule,
    TimeAgoPipeModule,
    TippyModule,
    NgxsModule.forFeature([HomeState]),
  ],
  providers: [
    {
      provide: BaseStorageService,
      useClass: HomeStorageService,
    },
  ],
})
export class HomeModule {}
