import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHovered]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HoveredDirective {
  private el: HTMLElement;
  constructor(el: ElementRef, private renderer: Renderer2) {
    this.el = el.nativeElement;
  }

  onMouseEnter() {
    this.renderer.addClass(this.el, 'hovered');
  }
  onMouseLeave() {
    this.renderer.removeClass(this.el, 'hovered');
  }
}
