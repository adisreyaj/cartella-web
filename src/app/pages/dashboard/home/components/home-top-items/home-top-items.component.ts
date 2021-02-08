import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home-stop-items',
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
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onSwiper(swiper: Swiper) {
    this.swiper = swiper;
    this.cdr.detectChanges();
  }

  onAfterInit(swiper: Swiper) {
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
