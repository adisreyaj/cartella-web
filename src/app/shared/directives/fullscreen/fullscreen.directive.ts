import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as sf from 'screenfull';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fullscreen]',
  exportAs: 'fullscreen',
})
export class FullscreenDirective implements OnInit, OnDestroy {
  private isMaximizedSubject = new BehaviorSubject(false);
  isMaximized$ = this.isMaximizedSubject.pipe();
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    (sf as sf.Screenfull).onchange(this.handleFullscreenChange);
  }
  ngOnDestroy() {
    (sf as sf.Screenfull).off('change', this.handleFullscreenChange);
  }

  private handleFullscreenChange = () => {
    if ((sf as sf.Screenfull).isFullscreen) {
      this.maximize();
    } else {
      this.minimize();
    }
  };
  toggle() {
    (sf as sf.Screenfull).toggle();
  }
  maximize() {
    if (this.el) {
      this.isMaximizedSubject.next(true);
      this.renderer.addClass(this.el.nativeElement, 'fullscreen');
    }
  }
  minimize() {
    if (this.el) {
      this.isMaximizedSubject.next(false);
      this.renderer.removeClass(this.el.nativeElement, 'fullscreen');
    }
  }
}
