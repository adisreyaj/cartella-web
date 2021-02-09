import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import Swiper, { SwiperOptions } from 'swiper';
import { HomeState } from '../../store/states/home.state';

@Component({
  selector: 'app-home-top-items',
  templateUrl: './home-top-items.component.html',
  styleUrls: ['./home-top-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTopItemsComponent implements OnInit {
  swiperBreakPoints: SwiperOptions['breakpoints'] = {
    600: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    960: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1100: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1400: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  };

  swiperPagination: SwiperOptions['pagination'] = false;
  swiper: Swiper = null;
  showNavigation = true;

  @Select(HomeState.getTopItems)
  top$: Observable<any[]>;
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onSwiper(swiper: Swiper) {
    this.swiper = swiper;
    this.cdr.detectChanges();
  }

  onAfterInit(swiper: Swiper) {
    this.updateNavigation(swiper);
  }

  onBreakpoint(swiper: Swiper) {
    // this.updateNavigation(swiper);
  }

  private updateNavigation(swiper: Swiper) {
    if (swiper.isEnd && swiper.isBeginning) {
      this.showNavigation = false;
      this.cdr.detectChanges();
    }
  }
  nextSlide() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }
  prevSlide() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }
}
