import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Bookmark } from '@cartella/bookmarks/shared/interfaces/bookmarks.interface';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { Package } from '@cartella/packages/shared/interfaces/packages.interface';
import { Snippet } from '@cartella/snippets/shared/interfaces/snippets.interface';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import Swiper, { SwiperOptions } from 'swiper';
import { HomeCardInput } from '../../interfaces/home.interface';
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

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}

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

  handleClick(item: HomeCardInput) {
    switch (item.type) {
      case FeatureType.bookmark:
        window.open((item.data as Partial<Bookmark>).url, '_blank');
        break;
      case FeatureType.snippet:
        this.router.navigate([
          '/snippets',
          (item.data as Partial<Snippet>)?.slug,
        ]);
        break;
      case FeatureType.package:
        window.open((item.data as Partial<Package>)?.repo, '_blank');
        break;
      default:
        break;
    }
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
