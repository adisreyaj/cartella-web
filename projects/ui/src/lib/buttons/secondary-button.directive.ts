import { Directive, HostBinding, Input } from '@angular/core';
import { BUTTON_SIZE_PADDINGS } from './buttons.config';

@Directive({
  selector: '[secondaryButton]',
})
export class SecondaryButtonDirective {
  @HostBinding('class') get classes() {
    return `btn-secondary rounded-md
     border border-transparent
     flex items-center
     bg-white
     ${BUTTON_SIZE_PADDINGS[this.size]}
     ${this.size === 'sm' ? 'text-sm' : 'text-base'}
     text-gray-600
     hover:bg-gray-100
     hover:text-gray-800
     focus:outline-none
     focus:border-primary
     focus:ring-primary focus:ring-1
     `;
  }

  @Input() size: 'sm' | 'lg' = 'lg';
}
