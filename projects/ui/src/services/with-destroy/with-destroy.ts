import { Injectable, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export abstract class WithDestroy implements OnDestroy {
  protected subs = new SubSink();
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
