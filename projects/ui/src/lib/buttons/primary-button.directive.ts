import { Directive, HostBinding, Input } from '@angular/core';
import { BUTTON_SIZE_PADDINGS } from './buttons.config';

@Directive({
  selector: '[primaryButton]',
})
export class PrimaryButtonDirective {
  @HostBinding('class') get classes() {
    return `btn-primary rounded-md
    flex items-center
    btn-${this.type}
    ${
      this.type === 'warn'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-primary hover:bg-primary-dark'
    }
    ${BUTTON_SIZE_PADDINGS[this.size]}
    ${this.size === 'sm' ? 'text-sm' : 'text-base'}
    text-white
    border
    border-transparent
    hover:shadow-m
    focus:outline-none
    focus:ring-primary focus:ring-1 focus:ring-offset-1
    `;
  }

  @Input() size: 'sm' | 'lg' = 'lg';
  @Input() type: 'normal' | 'warn' = 'normal';
}
