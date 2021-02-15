import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'loadDefault()',
  },
})
export class DefaultImageDirective implements OnInit {
  @Input() default: string;
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {}

  loadDefault() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.default);
  }
}
