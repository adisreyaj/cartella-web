import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src',
  },
})
export class DefaultImageDirective {
  @Input() src: string;
  @Input() default: string;

  updateUrl() {
    this.src = this.default;
    // this.renderer.setStyle(this.el.nativeElement, 'object-fit', 'contain');
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
