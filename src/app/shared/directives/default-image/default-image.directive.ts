import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(load)': 'loadImage()',
    '(error)': 'loadDefault()',
    '[src]': 'src',
  },
})
export class DefaultImageDirective implements OnInit {
  @Input() src: string;
  @Input() default: string;
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {}

  loadDefault() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.default);
  }

  loadImage() {
    if (this.src) {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.src);
    } else {
      this.renderer.setAttribute(this.el.nativeElement, 'src', this.default);
    }
  }
}
